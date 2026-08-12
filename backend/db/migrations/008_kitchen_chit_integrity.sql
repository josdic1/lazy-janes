ALTER TABLE kitchen_chits
  ADD CONSTRAINT kitchen_chits_id_order_id_unique
  UNIQUE (id, order_id);

ALTER TABLE kitchen_chit_items
  ADD CONSTRAINT kitchen_chit_items_same_order_fkey
  FOREIGN KEY (kitchen_chit_id, order_id)
  REFERENCES kitchen_chits (id, order_id);
