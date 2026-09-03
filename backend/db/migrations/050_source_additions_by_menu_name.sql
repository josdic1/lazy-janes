BEGIN;

WITH additions(item_name, ingredient_name, sort_order, price) AS (
  VALUES
    ('Grilled American or Swiss Cheese','Bacon',6010,2.00::numeric),
    ('Grilled American or Swiss Cheese','Ham',6020,2.00),
    ('Grilled American or Swiss Cheese','Taylor Ham',6030,2.00),
    ('Grilled American or Swiss Cheese','Tomato',7010,1.00),
    ('Buttermilk Pancakes','Ham',5010,3.00),
    ('Buttermilk Pancakes','Bacon',5020,3.00),
    ('Buttermilk Pancakes','Sausage',5030,3.00),
    ('Buttermilk Pancakes','Taylor Ham',5040,3.00),
    ('Blueberry Pancakes','Ham',5010,2.55),
    ('Blueberry Pancakes','Bacon',5020,2.55),
    ('Blueberry Pancakes','Sausage',5030,2.55),
    ('Blueberry Pancakes','Taylor Ham',5040,2.55),
    ('Belgian Waffle','Strawberries',5010,2.00),
    ('Greek Salad — Small','Grilled Chicken',9010,5.95),
    ('Greek Salad — Large','Grilled Chicken',9010,5.95)
)
INSERT INTO menu_item_additions (
  menu_item_id, ingredient_id, sort_order, is_active,
  price_adjustment, price_configured
)
SELECT i.id, g.id, a.sort_order, true, a.price, true
FROM additions a
JOIN menu_items i ON i.name = a.item_name
JOIN ingredients g ON lower(g.name)=lower(a.ingredient_name)
ON CONFLICT (menu_item_id, ingredient_id) DO UPDATE SET
  sort_order=EXCLUDED.sort_order,
  is_active=true,
  price_adjustment=EXCLUDED.price_adjustment,
  price_configured=true,
  updated_at=now();

COMMIT;
