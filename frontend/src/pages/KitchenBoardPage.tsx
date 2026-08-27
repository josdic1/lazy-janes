import {
  type StackOrder,
  type StackOrderItem,
} from "@lazy-janes/shared";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { markOrderItemsReady } from "../api/orders";
import { getStackSnapshot } from "../api/stack";

type KitchenTicket = {
  order: StackOrder;
  context: string;
  items: StackOrderItem[];
};

function elapsed(iso: string): string {
  const milliseconds = Date.now() - new Date(iso).getTime();
  const minutes = Math.max(0, Math.floor(milliseconds / 60_000));

  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function standaloneLabel(order: StackOrder): string {
  if (order.fulfillmentType === "takeout") {
    return order.customerName?.trim() || "Takeout";
  }

  if (order.fulfillmentType === "delivery") {
    return order.customerName?.trim() || "Delivery";
  }

  return "Dine In";
}

function orderType(order: StackOrder): string {
  if (order.fulfillmentType === "dine_in") return "DINE IN";
  if (order.fulfillmentType === "takeout") return "TAKEOUT";
  return "DELIVERY";
}

function ticketTone(order: StackOrder): "normal" | "warning" | "late" {
  const minutes = Math.max(
    0,
    Math.floor((Date.now() - new Date(order.submittedAt).getTime()) / 60_000),
  );

  if (minutes >= 20) return "late";
  if (minutes >= 10) return "warning";
  return "normal";
}

function KitchenItem({ item }: { item: StackOrderItem }) {
  return (
    <div className="kitchen-item">
      <div className="kitchen-item-line">
        <strong>
          {item.quantity > 1 ? `${item.quantity}× ` : ""}
          {item.itemName}
        </strong>
        {item.seatNumber ? <span>Seat {item.seatNumber}</span> : null}
      </div>

      {item.kitchenDetails.length > 0 ? (
        <ul className="kitchen-item-details">
          {item.kitchenDetails.map((detail, index) => (
            <li key={`${item.id}-${index}`}>{detail}</li>
          ))}
        </ul>
      ) : null}

      {item.kitchenNote ? (
        <div className="kitchen-item-note">
          NOTE · {item.kitchenNote}
        </div>
      ) : null}
    </div>
  );
}

function KitchenTicketCard({
  ticket,
  status,
  busy,
  onReady,
}: {
  ticket: KitchenTicket;
  status: "fired" | "ready";
  busy: boolean;
  onReady: () => void;
}) {
  const tone = ticketTone(ticket.order);

  return (
    <article
      className="kitchen-ticket"
      data-status={status}
      data-tone={tone}
    >
      <header className="kitchen-ticket-header">
        <div>
          <strong>{ticket.context}</strong>
          <span>{orderType(ticket.order)}</span>
        </div>
        <div className="kitchen-ticket-time">
          <strong>{elapsed(ticket.order.submittedAt)}</strong>
          <small>#{ticket.order.id.slice(0, 6).toUpperCase()}</small>
        </div>
      </header>

      <div className="kitchen-ticket-items">
        {ticket.items.map((item) => (
          <KitchenItem item={item} key={item.id} />
        ))}
      </div>

      {status === "fired" ? (
        <button
          type="button"
          className="kitchen-ready-button"
          disabled={busy}
          onClick={onReady}
        >
          {busy ? "UPDATING…" : `MARK ${ticket.items.length === 1 ? "ITEM" : "ALL"} READY`}
        </button>
      ) : (
        <footer className="kitchen-ready-footer">READY TO RUN</footer>
      )}
    </article>
  );
}

export function KitchenBoardPage() {
  const [snapshot, setSnapshot] = useState<Awaited<ReturnType<typeof getStackSnapshot>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [busyOrderId, setBusyOrderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadBoard = useCallback(async () => {
    try {
      const next = await getStackSnapshot();
      setSnapshot(next);
      setError(null);
    } catch (loadError: unknown) {
      setError(errorMessage(loadError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBoard();

    const interval = window.setInterval(() => {
      void loadBoard();
    }, 2_000);

    return () => window.clearInterval(interval);
  }, [loadBoard]);

  const kitchenOrders = useMemo(() => {
    if (!snapshot) return [];

    const partyOrders = snapshot.parties.flatMap((party) => {
      const tableContext =
        party.tables.length > 0
          ? party.tables.map((table) => `Table ${table.label}`).join(" + ")
          : null;
      const context = party.name && tableContext
        ? `${party.name} · ${tableContext}`
        : party.name ?? tableContext ?? `Party of ${party.guestCount}`;

      return party.orders.map((order) => ({ order, context }));
    });

    const standalone = snapshot.standaloneOrders.map((order) => ({
      order,
      context: standaloneLabel(order),
    }));

    return [...partyOrders, ...standalone]
      .filter(({ order }) => order.cancelledAt === null)
      .sort(
        (a, b) =>
          new Date(a.order.submittedAt).getTime() -
          new Date(b.order.submittedAt).getTime(),
      );
  }, [snapshot]);

  const firedTickets = useMemo<KitchenTicket[]>(
    () =>
      kitchenOrders
        .map(({ order, context }) => ({
          order,
          context,
          items: order.items.filter((item) => item.status === "fired"),
        }))
        .filter((ticket) => ticket.items.length > 0),
    [kitchenOrders],
  );

  const readyTickets = useMemo<KitchenTicket[]>(
    () =>
      kitchenOrders
        .map(({ order, context }) => ({
          order,
          context,
          items: order.items.filter((item) => item.status === "ready"),
        }))
        .filter((ticket) => ticket.items.length > 0),
    [kitchenOrders],
  );

  const firedItemCount = firedTickets.reduce(
    (count, ticket) => count + ticket.items.length,
    0,
  );
  const readyItemCount = readyTickets.reduce(
    (count, ticket) => count + ticket.items.length,
    0,
  );

  async function markTicketReady(ticket: KitchenTicket) {
    setBusyOrderId(ticket.order.id);
    setError(null);

    try {
      await markOrderItemsReady(ticket.order.id, {
        orderItemIds: ticket.items.map((item) => item.id),
      });
      await loadBoard();
    } catch (actionError: unknown) {
      setError(errorMessage(actionError));
    } finally {
      setBusyOrderId(null);
    }
  }

  if (loading) {
    return (
      <main className="kitchen-board-page">
        <p className="loading-state">Loading kitchen…</p>
      </main>
    );
  }

  return (
    <main className="kitchen-board-page">
      <header className="kitchen-board-header">
        <div>
          <p className="eyebrow">Lazy Jane’s / Kitchen</p>
          <h1>Kitchen Board</h1>
        </div>

        <div className="kitchen-live-status">
          <span aria-hidden="true" />
          LIVE · AUTO REFRESH
        </div>
      </header>

      <div className="kitchen-board-metrics">
        <div>
          <span>Cooking</span>
          <strong>{firedItemCount}</strong>
        </div>
        <div data-ready={readyItemCount > 0}>
          <span>Ready</span>
          <strong>{readyItemCount}</strong>
        </div>
      </div>

      {error ? <div className="form-error kitchen-board-error">{error}</div> : null}

      <div className="kitchen-stream">
        <section className="kitchen-lane" aria-labelledby="kitchen-cooking-heading">
          <header>
            <div>
              <span className="kitchen-lane-number">01</span>
              <h2 id="kitchen-cooking-heading">Cooking</h2>
            </div>
            <strong>{firedTickets.length} tickets</strong>
          </header>

          <div className="kitchen-ticket-grid">
            {firedTickets.length === 0 ? (
              <div className="kitchen-empty">Nothing cooking.</div>
            ) : (
              firedTickets.map((ticket) => (
                <KitchenTicketCard
                  key={`fired-${ticket.order.id}`}
                  ticket={ticket}
                  status="fired"
                  busy={busyOrderId === ticket.order.id}
                  onReady={() => void markTicketReady(ticket)}
                />
              ))
            )}
          </div>
        </section>

        <section className="kitchen-lane" data-ready="true" aria-labelledby="kitchen-ready-heading">
          <header>
            <div>
              <span className="kitchen-lane-number">02</span>
              <h2 id="kitchen-ready-heading">Ready</h2>
            </div>
            <strong>{readyTickets.length} tickets</strong>
          </header>

          <div className="kitchen-ticket-grid">
            {readyTickets.length === 0 ? (
              <div className="kitchen-empty">Nothing waiting to run.</div>
            ) : (
              readyTickets.map((ticket) => (
                <KitchenTicketCard
                  key={`ready-${ticket.order.id}`}
                  ticket={ticket}
                  status="ready"
                  busy={false}
                  onReady={() => undefined}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
