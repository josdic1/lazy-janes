import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getAuditEntries,
  getReportingSnapshot,
  type AuditEntry,
  type ReportCheckStatus,
  type ReportMode,
  type ReportPeriod,
  type ReportingCheck,
  type ReportingSnapshot,
} from "../api/reporting";

const PERIODS: Array<{ key: ReportPeriod; label: string }> = [
  { key: "today", label: "Today" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "ytd", label: "YTD" },
];

function money(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function integer(value: number): string {
  return new Intl.NumberFormat().format(value);
}

function titleCase(value: string): string {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function clockTime(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function dateTime(value: string | null): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

function checkNumber(check: ReportingCheck): string {
  return check.id.slice(0, 8).toUpperCase();
}

function trendLabel(bucket: string, period: ReportPeriod): string {
  if (period === "today") {
    const hour = Number(bucket.slice(-2));
    if (Number.isInteger(hour)) {
      return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
      }).format(new Date(2000, 0, 1, hour));
    }
    return bucket;
  }

  const date = new Date(`${bucket}T12:00:00`);
  return Number.isNaN(date.getTime())
    ? bucket
    : date.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
}

function rangeFor(period: ReportPeriod): { start: string; end: string } {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (period === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (period === "week") {
    const mondayOffset = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - mondayOffset);
    start.setHours(0, 0, 0, 0);
  } else if (period === "month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else {
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
  }

  end.setHours(23, 59, 59, 999);

  return {
    start: start.toISOString(),
    end: new Date(end.getTime() + 1).toISOString(),
  };
}

function csvCell(value: string): string {
  return `"${value.replaceAll('"', '""')}"`;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to load reports.";
}

export function ReportsPage() {
  const [params, setParams] = useSearchParams();

  const requestedMode = params.get("mode");
  const paramMode: ReportMode =
    requestedMode === "reporting" || requestedMode === "audit"
      ? requestedMode
      : "data";
  const requestedPeriod = params.get("period");
  const paramPeriod: ReportPeriod = PERIODS.some(
    (option) => option.key === requestedPeriod,
  )
    ? (requestedPeriod as ReportPeriod)
    : "today";

  const [mode, setMode] = useState<ReportMode>(paramMode);
  const [period, setPeriod] = useState<ReportPeriod>(paramPeriod);
  const [snapshot, setSnapshot] = useState<ReportingSnapshot | null>(null);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<"all" | ReportCheckStatus>("all");
  const [selectedCheckId, setSelectedCheckId] = useState<string | null>(
    params.get("check"),
  );
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (showSpinner = false) => {
      if (showSpinner) setRefreshing(true);

      try {
        const range = rangeFor(period);
        const [next, nextAudit] = await Promise.all([
          getReportingSnapshot({
            ...range,
            timezone:
              Intl.DateTimeFormat().resolvedOptions().timeZone ||
              "America/New_York",
          }),
          getAuditEntries(range),
        ]);

        setSnapshot(next);
        setAuditEntries(nextAudit);
        setError(null);

        const requestedCheck = params.get("check");
        const requestedParty = params.get("party");

        if (
          requestedCheck &&
          next.checks.some((check) => check.id === requestedCheck)
        ) {
          setSelectedCheckId(requestedCheck);
        } else if (requestedParty) {
          setSelectedCheckId(
            next.checks.find((check) => check.partyId === requestedParty)?.id ??
              null,
          );
        }
      } catch (loadError: unknown) {
        setError(errorMessage(loadError));
      } finally {
        setLoading(false);
        if (showSpinner) setRefreshing(false);
      }
    },
    [params, period],
  );

  useEffect(() => {
    void load();
  }, [load]);

  function updateLocation(nextMode: ReportMode, nextPeriod: ReportPeriod) {
    const next = new URLSearchParams(params);
    next.set("mode", nextMode);
    next.set("period", nextPeriod);
    setParams(next, { replace: true });
  }

  function chooseMode(nextMode: ReportMode) {
    setMode(nextMode);
    updateLocation(nextMode, period);
  }

  function choosePeriod(nextPeriod: ReportPeriod) {
    setPeriod(nextPeriod);
    setSelectedCheckId(null);
    const next = new URLSearchParams(params);
    next.set("mode", mode);
    next.set("period", nextPeriod);
    next.delete("party");
    next.delete("check");
    setParams(next, { replace: true });
  }

  const filteredChecks = useMemo(() => {
    const query = keyword.trim().toLowerCase();

    return (snapshot?.checks ?? []).filter((check) => {
      if (status !== "all" && check.status !== status) {
        return false;
      }

      if (!query) return true;

      const haystack = [
        checkNumber(check),
        check.label,
        check.partyName ?? "",
        check.openedByName,
        ...check.tableLabels,
        ...check.fulfillmentTypes,
        ...check.items.map((item) => item.itemName),
        ...check.payments.map((payment) => payment.method),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [keyword, snapshot, status]);

  const filteredAuditEntries = useMemo(() => {
    const query = keyword.trim().toLowerCase();
    if (!query) return auditEntries;

    return auditEntries.filter((entry) =>
      [
        entry.entityType,
        entry.entityLabel,
        entry.eventType,
        entry.actorName ?? entry.actorKind,
        entry.reason ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [auditEntries, keyword]);

  const selectedCheck =
    snapshot?.checks.find((check) => check.id === selectedCheckId) ?? null;

  const trendMax = Math.max(
    1,
    ...(snapshot?.trend.map((point) => point.sales) ?? [1]),
  );
  const topItemMax = Math.max(
    1,
    ...(snapshot?.topItems.map((item) => item.quantity) ?? [1]),
  );
  const paymentMax = Math.max(
    1,
    ...(snapshot?.paymentMix.map((item) => item.amount) ?? [1]),
  );
  const serviceMax = Math.max(
    1,
    ...(snapshot?.serviceMix.map((item) => item.count) ?? [1]),
  );

  function downloadCsv() {
    if (!snapshot) return;

    const headers = [
      "Check",
      "Status",
      "Guest",
      "Table",
      "Server",
      "Service",
      "Subtotal",
      "Tax",
      "Total",
      "Paid",
      "Created",
      "Presented",
      "Closed",
    ];

    const rows = filteredChecks.map((check) => [
      checkNumber(check),
      titleCase(check.status),
      check.partyName ?? check.label,
      check.tableLabels.join(" / "),
      check.openedByName,
      check.fulfillmentTypes.map(titleCase).join(" / "),
      check.subtotalAmount.toFixed(2),
      check.taxAmount.toFixed(2),
      check.totalAmount.toFixed(2),
      check.paidAmount.toFixed(2),
      check.createdAt,
      check.presentedAt ?? "",
      check.closedAt ?? "",
    ]);

    const csv = [
      headers.map(csvCell).join(","),
      ...rows.map((row) => row.map(csvCell).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `lazy-janes-${period}-checks.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  if (loading) {
    return (
      <main className="page reports-page">
        <p className="loading-state">Loading restaurant data…</p>
      </main>
    );
  }

  return (
    <main className="page reports-page">
      <header className="reports-heading">
        <div>
          <p className="eyebrow">Lazy Jane’s / Manager</p>
          <h1>Reports</h1>
          <p>See the business, then open the checks behind the numbers.</p>
        </div>
        <div className="reports-heading-actions">
          {snapshot ? (
            <small>Updated {clockTime(snapshot.generatedAt)}</small>
          ) : null}
          <button
            type="button"
            className="button"
            data-variant="quiet"
            disabled={refreshing}
            onClick={() => void load(true)}
          >
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </header>

      {error ? <div className="notice notice--error">{error}</div> : null}

      <div className="reports-control-bar">
        <nav className="reports-mode-tabs" aria-label="Report view">
          <button
            type="button"
            data-active={mode === "data"}
            onClick={() => chooseMode("data")}
          >
            Data
          </button>
          <button
            type="button"
            data-active={mode === "reporting"}
            onClick={() => chooseMode("reporting")}
          >
            Reporting
          </button>
          <button
            type="button"
            data-active={mode === "audit"}
            onClick={() => chooseMode("audit")}
          >
            Audit
          </button>
        </nav>

        <nav className="reports-period-tabs" aria-label="Report period">
          {PERIODS.map((option) => (
            <button
              type="button"
              key={option.key}
              data-active={period === option.key}
              onClick={() => choosePeriod(option.key)}
            >
              {option.label}
            </button>
          ))}
        </nav>
      </div>

      {snapshot && mode === "data" ? (
        <>
          <section className="reports-kpi-strip" aria-label="Key metrics">
            <button type="button" onClick={() => chooseMode("reporting")}>
              <span>Sales</span>
              <strong>{money(snapshot.metrics.sales)}</strong>
            </button>
            <button type="button" onClick={() => chooseMode("reporting")}>
              <span>Checks</span>
              <strong>{integer(snapshot.metrics.closedChecks)}</strong>
            </button>
            <button type="button" onClick={() => chooseMode("reporting")}>
              <span>Covers</span>
              <strong>{integer(snapshot.metrics.covers)}</strong>
            </button>
            <button type="button" onClick={() => chooseMode("reporting")}>
              <span>Avg check</span>
              <strong>{money(snapshot.metrics.averageCheck)}</strong>
            </button>
            <button type="button" onClick={() => chooseMode("reporting")}>
              <span>Avg / cover</span>
              <strong>{money(snapshot.metrics.averageCover)}</strong>
            </button>
            <button type="button" onClick={() => chooseMode("reporting")}>
              <span>Orders</span>
              <strong>{integer(snapshot.metrics.orders)}</strong>
            </button>
          </section>


          <section className="reports-duration-strip" aria-label="Average operating times">
            <div>
              <span>Wait → seated</span>
              <strong>{Math.round(snapshot.metrics.averageWaitMinutes)}m</strong>
            </div>
            <div>
              <span>At table</span>
              <strong>{Math.round(snapshot.metrics.averageTableMinutes)}m</strong>
            </div>
            <div>
              <span>Service</span>
              <strong>{Math.round(snapshot.metrics.averageServiceMinutes)}m</strong>
            </div>
            <div>
              <span>Kitchen</span>
              <strong>{Math.round(snapshot.metrics.averageKitchenMinutes)}m</strong>
            </div>
            <div>
              <span>Presented → paid</span>
              <strong>{Math.round(snapshot.metrics.averageCheckMinutes)}m</strong>
            </div>
          </section>

          <section className="reports-primary-chart">
            <header>
              <div>
                <p className="eyebrow">Sales rhythm</p>
                <h2>
                  {PERIODS.find((option) => option.key === period)?.label}
                </h2>
              </div>
              <strong>{money(snapshot.metrics.sales)}</strong>
            </header>

            {snapshot.trend.length === 0 ? (
              <div className="reports-empty">
                No closed checks in this period.
              </div>
            ) : (
              <div className="reports-trend">
                {snapshot.trend.map((point) => (
                  <div className="reports-trend-column" key={point.bucket}>
                    <div className="reports-trend-value">
                      {money(point.sales)}
                    </div>
                    <div className="reports-trend-track">
                      <span
                        style={{
                          height: `${Math.max(
                            4,
                            (point.sales / trendMax) * 100,
                          )}%`,
                        }}
                      />
                    </div>
                    <small>
                      {trendLabel(point.bucket, period)}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="reports-data-grid">
            <section className="reports-data-section">
              <header>
                <div>
                  <p className="eyebrow">What sold</p>
                  <h2>Top items</h2>
                </div>
              </header>
              <div className="reports-ranked-list">
                {snapshot.topItems.length === 0 ? (
                  <div className="reports-empty">No item sales yet.</div>
                ) : (
                  snapshot.topItems.map((item, index) => (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => {
                        setKeyword(item.name);
                        chooseMode("reporting");
                      }}
                    >
                      <b>{String(index + 1).padStart(2, "0")}</b>
                      <span>
                        <strong>{item.name}</strong>
                        <i>
                          <span
                            style={{
                              width: `${Math.max(
                                4,
                                (item.quantity / topItemMax) * 100,
                              )}%`,
                            }}
                          />
                        </i>
                      </span>
                      <em>
                        {item.quantity.toFixed(
                          item.quantity % 1 === 0 ? 0 : 1,
                        )}
                      </em>
                      <small>{money(item.sales)}</small>
                    </button>
                  ))
                )}
              </div>
            </section>

            <section className="reports-data-section">
              <header>
                <div>
                  <p className="eyebrow">Money</p>
                  <h2>Payment mix</h2>
                </div>
              </header>
              <div className="reports-mix-list">
                {snapshot.paymentMix.length === 0 ? (
                  <div className="reports-empty">
                    No successful payments yet.
                  </div>
                ) : (
                  snapshot.paymentMix.map((payment) => (
                    <div key={payment.method}>
                      <span>
                        <strong>{titleCase(payment.method)}</strong>
                        <small>
                          {payment.count} payment
                          {payment.count === 1 ? "" : "s"}
                        </small>
                      </span>
                      <i>
                        <span
                          style={{
                            width: `${Math.max(
                              4,
                              (payment.amount / paymentMax) * 100,
                            )}%`,
                          }}
                        />
                      </i>
                      <b>{money(payment.amount)}</b>
                    </div>
                  ))
                )}
                <div className="reports-inline-stat">
                  <span>Tips</span>
                  <strong>{money(snapshot.metrics.tips)}</strong>
                </div>
              </div>
            </section>

            <section className="reports-data-section">
              <header>
                <div>
                  <p className="eyebrow">Service</p>
                  <h2>Order mix</h2>
                </div>
              </header>
              <div className="reports-mix-list">
                {snapshot.serviceMix.length === 0 ? (
                  <div className="reports-empty">No orders yet.</div>
                ) : (
                  snapshot.serviceMix.map((service) => (
                    <div key={service.fulfillmentType}>
                      <span>
                        <strong>
                          {titleCase(service.fulfillmentType)}
                        </strong>
                        <small>
                          {service.count} order
                          {service.count === 1 ? "" : "s"}
                        </small>
                      </span>
                      <i>
                        <span
                          style={{
                            width: `${Math.max(
                              4,
                              (service.count / serviceMax) * 100,
                            )}%`,
                          }}
                        />
                      </i>
                      <b>{service.count}</b>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="reports-data-section reports-exceptions">
              <header>
                <div>
                  <p className="eyebrow">Review</p>
                  <h2>Exceptions</h2>
                </div>
              </header>
              <dl>
                <div>
                  <dt>Voided items</dt>
                  <dd>{snapshot.metrics.voidedItems}</dd>
                </div>
                <div>
                  <dt>Cancelled orders</dt>
                  <dd>{snapshot.metrics.cancelledOrders}</dd>
                </div>
                <div>
                  <dt>Manual / TBD prices</dt>
                  <dd>{snapshot.metrics.manualPrices}</dd>
                </div>
              </dl>
            </section>
          </div>
        </>
      ) : null}


      {mode === "audit" ? (
        <section className="reports-audit-shell">
          <div className="reports-audit-tools">
            <div>
              <strong>{filteredAuditEntries.length} events</strong>
              <small>Read-only operating history</small>
            </div>
            <input
              type="search"
              placeholder="Search person, action, check, order, item…"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>

          <div className="reports-table-wrap">
            <table className="reports-table reports-audit-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Area</th>
                  <th>Action</th>
                  <th>Record</th>
                  <th>Who</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {filteredAuditEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{dateTime(entry.occurredAt)}</td>
                    <td>{titleCase(entry.entityType)}</td>
                    <td><strong>{titleCase(entry.eventType)}</strong></td>
                    <td>{entry.entityLabel}</td>
                    <td>{entry.actorName ?? titleCase(entry.actorKind)}</td>
                    <td>{entry.reason ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAuditEntries.length === 0 ? (
              <div className="reports-empty">No audit events match this view.</div>
            ) : null}
          </div>
        </section>
      ) : null}

      {snapshot && mode === "reporting" ? (
        <section
          className="reports-reporting-shell"
          data-detail-open={selectedCheck !== null}
        >
          <div className="reports-reporting-main">
            <div className="reports-reporting-tools">
              <div>
                <strong>{snapshot.reportingTotal} checks in period</strong>
                {snapshot.reportingTotal > snapshot.checks.length ? (
                  <small>Showing latest {snapshot.checks.length}</small>
                ) : null}
              </div>
              <input
                type="search"
                placeholder="Search check, guest, table, server, item…"
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
              />
              <select
                aria-label="Check status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "all" | ReportCheckStatus)
                }
              >
                <option value="all">All statuses</option>
                <option value="closed">Closed</option>
                <option value="presented">Presented</option>
                <option value="open">Open</option>
              </select>
              <button
                type="button"
                className="button"
                data-variant="quiet"
                disabled={filteredChecks.length === 0}
                onClick={downloadCsv}
              >
                Export CSV
              </button>
            </div>

            <div className="reports-table-wrap">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Check</th>
                    <th>Guest / Table</th>
                    <th>Server</th>
                    <th>Service</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredChecks.map((check) => (
                    <tr
                      key={check.id}
                      data-selected={selectedCheckId === check.id}
                      onClick={() => {
                        setSelectedCheckId(check.id);
                        const next = new URLSearchParams(params);
                        next.set("mode", "reporting");
                        next.set("period", period);
                        next.set("check", check.id);
                        next.delete("party");
                        setParams(next, { replace: true });
                      }}
                    >
                      <td>
                        <strong>#{checkNumber(check)}</strong>
                        <small>{check.label}</small>
                      </td>
                      <td>
                        <strong>{check.partyName ?? "Standalone"}</strong>
                        <small>
                          {check.tableLabels.length > 0
                            ? `Table ${check.tableLabels.join(", ")}`
                            : check.guestCount
                              ? `${check.guestCount} covers`
                              : "—"}
                        </small>
                      </td>
                      <td>{check.openedByName}</td>
                      <td>
                        {check.fulfillmentTypes.map(titleCase).join(" / ") ||
                          "—"}
                      </td>
                      <td>
                        <strong>{money(check.totalAmount)}</strong>
                      </td>
                      <td>
                        {check.payments.length > 0
                          ? [
                              ...new Set(
                                check.payments.map((payment) =>
                                  titleCase(payment.method),
                                ),
                              ),
                            ].join(" / ")
                          : "—"}
                      </td>
                      <td>
                        <span
                          className="reports-status"
                          data-status={check.status}
                        >
                          {titleCase(check.status)}
                        </span>
                      </td>
                      <td>
                        {dateTime(
                          check.closedAt ??
                            check.presentedAt ??
                            check.createdAt,
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredChecks.length === 0 ? (
                <div className="reports-empty">
                  No checks match those filters.
                </div>
              ) : null}
            </div>
          </div>

          {selectedCheck ? (
            <aside
              className="reports-detail"
              aria-label={`Check ${checkNumber(selectedCheck)}`}
            >
              <header>
                <div>
                  <p className="eyebrow">Check</p>
                  <h2>#{checkNumber(selectedCheck)}</h2>
                  <span>
                    {selectedCheck.partyName ?? selectedCheck.label}
                  </span>
                </div>
                <button
                  type="button"
                  className="operations-text-button"
                  onClick={() => {
                    setSelectedCheckId(null);
                    const next = new URLSearchParams(params);
                    next.delete("check");
                    next.delete("party");
                    setParams(next, { replace: true });
                  }}
                >
                  Close
                </button>
              </header>

              <dl className="reports-detail-facts">
                <div>
                  <dt>Total</dt>
                  <dd>{money(selectedCheck.totalAmount)}</dd>
                </div>
                <div>
                  <dt>Paid</dt>
                  <dd>{money(selectedCheck.paidAmount)}</dd>
                </div>
                <div>
                  <dt>Tax</dt>
                  <dd>{money(selectedCheck.taxAmount)}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>{titleCase(selectedCheck.status)}</dd>
                </div>
                <div>
                  <dt>Table</dt>
                  <dd>{selectedCheck.tableLabels.join(", ") || "—"}</dd>
                </div>
                <div>
                  <dt>Covers</dt>
                  <dd>{selectedCheck.guestCount ?? "—"}</dd>
                </div>
                <div>
                  <dt>Opened by</dt>
                  <dd>{selectedCheck.openedByName}</dd>
                </div>
                <div>
                  <dt>Closed</dt>
                  <dd>{dateTime(selectedCheck.closedAt)}</dd>
                </div>
              </dl>

              <section className="reports-detail-section">
                <header>
                  <span>Items</span>
                  <strong>{selectedCheck.items.length}</strong>
                </header>
                <div className="reports-detail-list">
                  {selectedCheck.items.map((item) => (
                    <div key={item.id}>
                      <span>
                        <strong>
                          {item.allocatedQuantity
                            .toFixed(3)
                            .replace(/\.?0+$/, "")}
                          × {item.itemName}
                        </strong>
                        <small>
                          {titleCase(item.fulfillmentType)}
                          {item.seatNumber
                            ? ` · Seat ${item.seatNumber}`
                            : ""}
                        </small>
                      </span>
                      <b>{money(item.allocatedAmount)}</b>
                    </div>
                  ))}
                </div>
              </section>

              <section className="reports-detail-section">
                <header>
                  <span>Payments</span>
                  <strong>{selectedCheck.payments.length}</strong>
                </header>
                <div className="reports-detail-list">
                  {selectedCheck.payments.length === 0 ? (
                    <div className="reports-detail-empty">
                      No successful payment recorded.
                    </div>
                  ) : (
                    selectedCheck.payments.map((payment) => (
                      <div key={payment.id}>
                        <span>
                          <strong>{titleCase(payment.method)}</strong>
                          <small>{dateTime(payment.succeededAt)}</small>
                        </span>
                        <b>{money(payment.allocatedAmount)}</b>
                      </div>
                    ))
                  )}
                </div>
              </section>

              {selectedCheck.partyEvents.length > 0 ? (
                <section className="reports-detail-section">
                  <header>
                    <span>Service history</span>
                    <strong>{selectedCheck.partyEvents.length}</strong>
                  </header>
                  <ol className="reports-timeline">
                    {selectedCheck.partyEvents.map((event) => (
                      <li key={event.id}>
                        <span>{clockTime(event.occurredAt)}</span>
                        <strong>{titleCase(event.eventType)}</strong>
                        <small>
                          {[event.actorName, event.reason]
                            .filter(Boolean)
                            .join(" · ")}
                        </small>
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}
            </aside>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
