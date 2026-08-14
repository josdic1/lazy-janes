-- Lazy Jane's initial menu seed
-- Source: supplied Ritz Diner menu JSON
-- This file is intentionally explicit and runs only against an empty menu.

-- Stage the source menu taxonomy, then resolve it to the
-- first-class menu_groups/menu_categories records created by migrations.

CREATE TEMP TABLE seed_menu_items (
  name text NOT NULL,
  description text,
  group_name text NOT NULL,
  category text NOT NULL,
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  is_special boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL
) ON COMMIT DROP;

-- Chicken Cutlet Sandwiches
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Drunken Chicken', 'Vodka sauce & fresh mozzarella cheese.', 'Sandwiches & Deli', 'Chicken Cutlet Sandwiches', 16.95, false, 1),
  ('Buffalo Cheese', 'Buffalo sauce, cheddar cheese, and lettuce.', 'Sandwiches & Deli', 'Chicken Cutlet Sandwiches', 16.95, false, 2),
  ('BLT Ranch', 'Bacon, lettuce, tomato, American cheese, and ranch dressing.', 'Sandwiches & Deli', 'Chicken Cutlet Sandwiches', 16.95, false, 3),
  ('The Pesto', 'Fresh mozzarella, sun-dried tomatoes, and pesto.', 'Sandwiches & Deli', 'Chicken Cutlet Sandwiches', 16.95, false, 4),
  ('The Caprese', 'Fresh mozzarella, roasted peppers, arugula, and balsamic glaze.', 'Sandwiches & Deli', 'Chicken Cutlet Sandwiches', 16.95, false, 5),
  ('The David', 'Fresh mozzarella, pepperoni, and olive oil.', 'Sandwiches & Deli', 'Chicken Cutlet Sandwiches', 16.95, false, 6),
  ('The Arizona', 'Jalapeño peppers, red onions, lettuce, and chipotle mayo.', 'Sandwiches & Deli', 'Chicken Cutlet Sandwiches', 16.95, false, 7);

-- Buttermilk Fried Chicken Sandwiches
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('The Ritz', 'Pickles, avocado, red onions, lettuce & chipotle mayo.', 'Sandwiches & Deli', 'Fried Chicken Sandwiches', 16.95, false, 8),
  ('The Texan', 'Bacon, cheddar cheese, fried string onions, and BBQ sauce.', 'Sandwiches & Deli', 'Fried Chicken Sandwiches', 16.95, false, 9),
  ('The Italian', 'Marinara sauce and mozzarella cheese.', 'Sandwiches & Deli', 'Fried Chicken Sandwiches', 16.95, false, 10),
  ('The Monte', 'Ham, Swiss cheese, and honey mustard.', 'Sandwiches & Deli', 'Fried Chicken Sandwiches', 16.95, false, 11),
  ('The Club', 'Bacon, lettuce, tomato, and mayo.', 'Sandwiches & Deli', 'Fried Chicken Sandwiches', 16.95, false, 12);

-- Wraps
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Buffalo Chicken Wrap', 'Grilled chicken in buffalo sauce with romaine lettuce, tomatoes, and blue cheese.', 'Sandwiches & Deli', 'Wraps', 15.95, false, 13),
  ('Philly Cheesesteak Wrap', 'With sauteed onions.', 'Sandwiches & Deli', 'Wraps', 15.95, false, 14),
  ('Blackened Chicken Wrap', 'With avocado, black beans, & tomatoes.', 'Sandwiches & Deli', 'Wraps', 15.95, false, 15),
  ('Turkey Wrap Special', 'With lettuce, goat cheese, and avocado in a honey mustard dressing.', 'Sandwiches & Deli', 'Wraps', 15.95, false, 16),
  ('BBQ Beef Wrap', 'Roast beef, mozzarella cheese, & fried onions.', 'Sandwiches & Deli', 'Wraps', 15.95, false, 17),
  ('Gyro Wrap', 'With avocado, lettuce, and tomatoes in a creamy Italian dressing.', 'Sandwiches & Deli', 'Wraps', 15.95, false, 18),
  ('Tex Mex Wrap', 'Grilled chicken, tomatoes, Monterey Jack cheese, black beans, avocado, and sour cream.', 'Sandwiches & Deli', 'Wraps', 15.95, false, 19),
  ('Grilled Chicken Pesto Wrap', 'Roasted peppers, tomatoes, red onions, and pesto sauce.', 'Sandwiches & Deli', 'Wraps', 15.95, false, 20),
  ('Chicken Caesar Wrap', NULL, 'Sandwiches & Deli', 'Wraps', 15.95, false, 21);

-- Specials
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Lemon Shrimp Salad', 'Pieces of shrimp with roasted peppers, bacon, red onions, string beans, tomatoes, mesclun, and scallions in a lemon garlic dressing', 'Specials', 'Specials', 19.95, true, 22),
  ('Marion’s Chopped Salad', 'With sesame chicken, portabella mushrooms, iceberg lettuce, carrots, cucumbers, fresh mozzarella, and almonds with black olive dressing or a choice of dressing', 'Specials', 'Specials', 16.95, true, 23),
  ('South Beach Salad with Grilled Chicken', 'Fresh spinach with goat cheese, sun-dried cranberries, avocado, red onions, and tomatoes in a white balsamic dressing', 'Specials', 'Specials', 15.95, true, 24),
  ('Insalata Italiano', 'Marinated grilled chicken, tossed with fresh mozzarella, roasted peppers, artichoke hearts, and tomatoes in an olive oil and lemon dressing', 'Specials', 'Specials', 15.95, true, 25),
  ('Paulo’s Salad with Grilled Chicken', 'Poached pears, walnuts, and raisins over mixed greens in a raspberry vinaigrette dressing', 'Specials', 'Specials', 15.95, true, 26),
  ('Teriyaki Chicken Salad', 'Strips of marinated chicken, with walnuts, mandarin oranges, snow peas, and mixed greens, topped with fried noodles in a teriyaki dressing', 'Specials', 'Specials', 15.95, true, 27),
  ('Focaccia Sandwich', 'Grilled chicken, roasted peppers, and fresh mozzarella with pesto sauce', 'Specials', 'Specials', 15.95, true, 28),
  ('Avocado Tuna Salad', 'White chunk tuna with avocado, cucumbers, red onions, and cilantro in a lemon vinaigrette', 'Specials', 'Specials', 17.95, true, 29),
  ('Strawberry Spinach Salad', 'With fresh spinach, strawberries, and sesame seeds with a choice of blackened salmon or chicken in a poppy white wine vinaigrette', 'Specials', 'Specials', 19.95, true, 30),
  ('Coconut Chicken Ala Ritz', 'With caramelized pears, sun-dried cranberries, green apples, and walnuts in a white balsamic dressing', 'Specials', 'Specials', 15.95, true, 31),
  ('String Bean Salad with Grilled Chicken', 'With tomatoes, fresh mozzarella, and red onions in a honey balsamic dressing', 'Specials', 'Specials', 15.95, true, 32),
  ('Southwest Cobb Salad', 'With blackened chicken, iceberg lettuce, cilantro, corn, black beans, and red peppers, topped with Monterey Jack and cheddar cheese', 'Specials', 'Specials', 15.95, true, 33),
  ('Mango Barley Chicken Salad', 'With chopped red and green peppers, red onion, chopped mango, barley with a choice of sesame or marinated chicken tossed in lime juice, olive oil, cilantro, honey, and dijon mustard', 'Specials', 'Specials', 15.95, true, 34),
  ('Pan Fried Crab Cake Sandwich', 'With roasted peppers, avocado, and lettuce with tartar sauce', 'Specials', 'Specials', 18.95, true, 35),
  ('Focaccia Special', 'Grilled chicken, roasted peppers, and fresh mozzarella with a pesto sauce', 'Specials', 'Specials', 15.95, true, 36),
  ('Teriyaki Chicken Sub', 'Grilled chicken in a teriyaki sauce with lettuce, tomato, and avocado', 'Specials', 'Specials', 15.95, true, 37),
  ('Montreal Chicken Quinoa Salad', 'Grilled Montreal chicken, zucchini, tomatoes, cucumber, carrots, mixed greens, and chickpeas in a lemon vinaigrette dressing', 'Specials', 'Specials', 15.95, true, 38),
  ('Chopped Burger Salad', 'With tomatoes, red onions, cucumbers, lettuce, Monterey Jack cheese, and pickles', 'Specials', 'Specials', 15.95, true, 39),
  ('Crispy Buffalo Chicken Salad', 'Mixed buffalo chicken with diced tomatoes and bleu cheese over romaine lettuce', 'Specials', 'Specials', 15.95, true, 40),
  ('Grilled Chicken Italian Sub', 'Marinated chicken, roasted peppers, fresh mozzarella, and sun-dried tomatoes pesto', 'Specials', 'Specials', 15.95, true, 41),
  ('Three Bean Chicken Salad', 'Red, white, and black beans with grilled chicken, scallions, and cherry tomatoes over romaine lettuce in a cilantro lime vinaigrette', 'Specials', 'Specials', 15.95, true, 42);

-- Gluten Free Dinner - Pasta
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Eggplant Rollatini', NULL, 'Gluten Free', 'Dinner — Pasta', 27.95, false, 43),
  ('Meat Lasagna', NULL, 'Gluten Free', 'Dinner — Pasta', 27.50, false, 44),
  ('Veggie Lasagna', NULL, 'Gluten Free', 'Dinner — Pasta', 27.50, false, 45),
  ('Penne Pasta with Meatballs', NULL, 'Gluten Free', 'Dinner — Pasta', 22.35, false, 46),
  ('Fusilli Pasta with Meatballs', NULL, 'Gluten Free', 'Dinner — Pasta', 22.35, false, 47),
  ('Mac and Cheese', 'Kids $13.95', 'Gluten Free', 'Dinner — Pasta', 19.95, false, 48),
  ('Cheese Ravioli', NULL, 'Gluten Free', 'Dinner — Pasta', 21.95, false, 49);

-- Gluten Free Dinner - Chicken
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Chicken Française', 'Served with choice of pasta or vegetables', 'Gluten Free', 'Dinner — Chicken', 30.95, false, 50),
  ('Chicken Parmesan', 'Served with choice of pasta or vegetables', 'Gluten Free', 'Dinner — Chicken', 30.95, false, 51),
  ('Chicken Fingers', 'Served with choice of pasta or vegetables', 'Gluten Free', 'Dinner — Chicken', 19.95, false, 52);

-- Gluten Free Dinner - Fish
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Fried Filet', 'Served with choice of pasta or vegetables', 'Gluten Free', 'Dinner — Fish', 26.95, false, 53),
  ('Fried Shrimp', 'Served with choice of pasta or vegetables', 'Gluten Free', 'Dinner — Fish', 30.95, false, 54),
  ('Shrimp Francaise', 'Served with choice of pasta or vegetables', 'Gluten Free', 'Dinner — Fish', 30.95, false, 55),
  ('Sole Francaise', 'Served with choice of pasta or vegetables', 'Gluten Free', 'Dinner — Fish', 29.95, false, 56);

-- Gluten Free Dinner - Meat
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Veal Francaise', 'Served with choice of pasta or vegetables', 'Gluten Free', 'Dinner — Meat', 32.95, false, 57),
  ('Veal Parmesan', 'Served with choice of pasta or vegetables', 'Gluten Free', 'Dinner — Meat', 32.95, false, 58);

-- Gluten Free Lunch - Pasta
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Eggplant Rollatini', NULL, 'Gluten Free', 'Lunch — Pasta', 22.95, false, 59),
  ('Meat Lasagna', NULL, 'Gluten Free', 'Lunch — Pasta', 22.95, false, 60),
  ('Veggie Lasagna', NULL, 'Gluten Free', 'Lunch — Pasta', 22.95, false, 61),
  ('Penne Pasta with Meatballs', NULL, 'Gluten Free', 'Lunch — Pasta', 22.95, false, 62),
  ('Fussilli Pasta with Meatballs', NULL, 'Gluten Free', 'Lunch — Pasta', 22.95, false, 63),
  ('Mac and Cheese', 'Kids $13.95', 'Gluten Free', 'Lunch — Pasta', 17.65, false, 64),
  ('Cheese Ravioli', NULL, 'Gluten Free', 'Lunch — Pasta', 21.95, false, 65);

-- Gluten Free Lunch - Chicken
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Chicken Fingers', NULL, 'Gluten Free', 'Lunch — Chicken', 17.95, false, 66);

-- Gluten Free Lunch - Sandwiches
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Tuna Salad', NULL, 'Gluten Free', 'Lunch — Sandwiches', 14.95, false, 67),
  ('Chicken Salad', NULL, 'Gluten Free', 'Lunch — Sandwiches', 14.95, false, 68),
  ('Egg Salad', NULL, 'Gluten Free', 'Lunch — Sandwiches', 11.95, false, 69),
  ('Chunky Shrimp Salad', NULL, 'Gluten Free', 'Lunch — Sandwiches', 21.95, false, 70),
  ('Roast Beef', NULL, 'Gluten Free', 'Lunch — Sandwiches', 16.95, false, 71),
  ('Turkey', NULL, 'Gluten Free', 'Lunch — Sandwiches', 16.95, false, 72),
  ('Bacon, Lettuce and Tomato', NULL, 'Gluten Free', 'Lunch — Sandwiches', 11.95, false, 73),
  ('Individual Tuna', NULL, 'Gluten Free', 'Lunch — Sandwiches', 14.95, false, 74),
  ('Individual Salmon', NULL, 'Gluten Free', 'Lunch — Sandwiches', 15.95, false, 75),
  ('Ham and Cheese', NULL, 'Gluten Free', 'Lunch — Sandwiches', 15.95, false, 76),
  ('Salami', NULL, 'Gluten Free', 'Lunch — Sandwiches', 14.95, false, 77);

-- Appetizers & Fruits
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Canton Chicken Wings', NULL, 'Lunch & Dinner', 'Appetizers & Fruits', 14.10, false, 78),
  ('Baked Clams', NULL, 'Lunch & Dinner', 'Appetizers & Fruits', 11.95, false, 79),
  ('Stuffed Mushrooms', NULL, 'Lunch & Dinner', 'Appetizers & Fruits', 12.45, false, 80),
  ('Basket of Fried Zucchini', NULL, 'Lunch & Dinner', 'Appetizers & Fruits', 9.95, false, 81),
  ('Fried Mozzarella Sticks', NULL, 'Lunch & Dinner', 'Appetizers & Fruits', 11.35, false, 82),
  ('Chopped Chicken Livers', NULL, 'Lunch & Dinner', 'Appetizers & Fruits', 9.95, false, 83),
  ('Cup of Homemade Chili', NULL, 'Lunch & Dinner', 'Appetizers & Fruits', 8.45, false, 84),
  ('Shrimp Cocktail', NULL, 'Lunch & Dinner', 'Appetizers & Fruits', 15.50, false, 85),
  ('Fried Calamari', NULL, 'Lunch & Dinner', 'Appetizers & Fruits', 13.95, false, 86),
  ('Feta Cheese & Tomato Salad', NULL, 'Lunch & Dinner', 'Appetizers & Fruits', 10.55, false, 87),
  ('Fresh Fruit Cup', NULL, 'Lunch & Dinner', 'Appetizers & Fruits', 6.95, false, 88),
  ('Fresh Melon (In Season)', NULL, 'Lunch & Dinner', 'Appetizers & Fruits', 6.30, false, 89),
  ('Nachos', 'Tortilla chips topped with chili, melted cheddar, pico de gallo, salsa & house made guacamole', 'Lunch & Dinner', 'Appetizers & Fruits', 13.95, false, 90);

-- Soups
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Crock of French Onion Soup', NULL, 'Lunch & Dinner', 'Soups', 6.50, false, 91),
  ('Chicken Soup with Matzoh Ball or Noodles — Cup', NULL, 'Lunch & Dinner', 'Soups', 3.80, false, 92),
  ('Chicken Soup with Matzoh Ball or Noodles — Bowl', NULL, 'Lunch & Dinner', 'Soups', 5.35, false, 93),
  ('Soup Du Jour — Cup', NULL, 'Lunch & Dinner', 'Soups', 3.80, false, 94),
  ('Soup Du Jour — Bowl', NULL, 'Lunch & Dinner', 'Soups', 5.35, false, 95),
  ('Quart of Soup To Go', NULL, 'Lunch & Dinner', 'Soups', 11.95, false, 96),
  ('Crock of Onion Soup', 'Topped with melted cheese, served with salad and garlic bread', 'Lunch & Dinner', 'Soups', 10.95, false, 97);

-- Entrees
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Szechuan Chicken', 'A stir-fried specialty with vegetables and cashews', 'Lunch & Dinner', 'Entrees', 27.95, false, 98),
  ('Szechuan Shrimp', NULL, 'Lunch & Dinner', 'Entrees', 29.95, false, 99),
  ('Chicken Familia', 'Potatoes, mushrooms, onions and garlic', 'Lunch & Dinner', 'Entrees', 27.95, false, 100),
  ('Spanish Chicken', 'Onions, potatoes and tomato', 'Lunch & Dinner', 'Entrees', 27.95, false, 101),
  ('Char-Grilled Half Chicken', 'Marinated and grilled to perfection', 'Lunch & Dinner', 'Entrees', 23.95, false, 102),
  ('Golden Roasted Half Chicken', 'With stuffing', 'Lunch & Dinner', 'Entrees', 23.95, false, 103),
  ('Sauteed Calves Liver', 'Smothered in onions', 'Lunch & Dinner', 'Entrees', 23.95, false, 104),
  ('Roast Turkey with All the Fixins', 'Stuffing and cranberry sauce', 'Lunch & Dinner', 'Entrees', 23.95, false, 105),
  ('Brisket of Beef Platter', 'In the traditional style', 'Lunch & Dinner', 'Entrees', 23.95, false, 106),
  ('Low Fat Turkey Meat Loaf', NULL, 'Lunch & Dinner', 'Entrees', 20.95, false, 107),
  ('Southern Fried Chicken', 'A basket of tender fried chicken', 'Lunch & Dinner', 'Entrees', 18.95, false, 108),
  ('Chicken Lo Mein', 'With stir-fry vegetables', 'Lunch & Dinner', 'Entrees', 27.95, false, 109),
  ('Chicken Giambotta', 'Sausage, mushrooms, onions and potatoes', 'Lunch & Dinner', 'Entrees', 27.95, false, 110);

-- From the Sea
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Broiled Salmon or Tuna', NULL, 'Lunch & Dinner', 'From the Sea', 27.95, false, 111),
  ('Shrimp Scampi', NULL, 'Lunch & Dinner', 'From the Sea', 28.95, false, 112),
  ('Fried Scallops', NULL, 'Lunch & Dinner', 'From the Sea', 28.75, false, 113),
  ('Fried Clams in The Basket', NULL, 'Lunch & Dinner', 'From the Sea', 17.95, false, 114),
  ('Fried Flounder', 'Lemon wedge', 'Lunch & Dinner', 'From the Sea', 22.95, false, 115),
  ('Fried Shrimp Basket', NULL, 'Lunch & Dinner', 'From the Sea', 27.95, false, 116),
  ('Broiled Swordfish', NULL, 'Lunch & Dinner', 'From the Sea', 30.95, false, 117),
  ('Broiled Sea Scallops', NULL, 'Lunch & Dinner', 'From the Sea', 29.95, false, 118),
  ('Garlic Salmon Balsamic', NULL, 'Lunch & Dinner', 'From the Sea', 27.95, false, 119),
  ('Stuffed Shrimp', NULL, 'Lunch & Dinner', 'From the Sea', 29.95, false, 120),
  ('Sole Francaise', NULL, 'Lunch & Dinner', 'From the Sea', 26.95, false, 121),
  ('Broiled Scrod', NULL, 'Lunch & Dinner', 'From the Sea', 23.95, false, 122),
  ('Broiled Flounder', NULL, 'Lunch & Dinner', 'From the Sea', 24.95, false, 123),
  ('Broiled or Fried Combo Platter', 'Scallops, clams, shrimp, flounder & swordfish', 'Lunch & Dinner', 'From the Sea', 28.95, false, 124),
  ('Grilled Shrimp', 'Served over garlic mashed & julienne vegetables', 'Lunch & Dinner', 'From the Sea', 27.95, false, 125),
  ('Grilled Shrimp Pasta', 'Over arugula, tomato, onions & cold pasta with balsamic', 'Lunch & Dinner', 'From the Sea', 28.95, false, 126);

-- Prime Streaks & Chops
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('New York Strip (16 oz.)', NULL, 'Lunch & Dinner', 'Prime Steaks & Chops', 34.95, false, 127),
  ('Ground Sirloin', 'With mushroom and onions', 'Lunch & Dinner', 'Prime Steaks & Chops', 20.95, false, 128),
  ('Grilled Center Cut Pork Chops', 'With potato pancake & applesauce', 'Lunch & Dinner', 'Prime Steaks & Chops', 25.95, false, 129),
  ('Char-Grilled Turkey Steak', 'Roasted garlic and onions mixed with fresh ground turkey', 'Lunch & Dinner', 'Prime Steaks & Chops', 22.95, false, 130),
  ('Sliced Skirt Steak Platter', 'On toast, brown onions and mushrooms', 'Lunch & Dinner', 'Prime Steaks & Chops', 25.95, false, 131);

-- Italian Specialties
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Chicken Parmigiana', 'With spaghetti', 'Lunch & Dinner', 'Italian Specialties', 23.95, false, 132),
  ('Veal Cutlet Parmigiana', 'With spaghetti', 'Lunch & Dinner', 'Italian Specialties', 27.95, false, 133),
  ('Cheese Ravioli', NULL, 'Lunch & Dinner', 'Italian Specialties', 18.95, false, 134),
  ('Spaghetti with Meatballs', NULL, 'Lunch & Dinner', 'Italian Specialties', 17.95, false, 135),
  ('Eggplant Parmigiana', 'With spaghetti', 'Lunch & Dinner', 'Italian Specialties', 19.95, false, 136),
  ('Linguini', 'White or red clam sauce', 'Lunch & Dinner', 'Italian Specialties', 21.95, false, 137),
  ('Chicken Francaise', NULL, 'Lunch & Dinner', 'Italian Specialties', 26.95, false, 138),
  ('Veal Francaise', NULL, 'Lunch & Dinner', 'Italian Specialties', 28.95, false, 139),
  ('Breaded Veal Cutlet', 'With spaghetti', 'Lunch & Dinner', 'Italian Specialties', 28.95, false, 140),
  ('Vegetable Lasagna', NULL, 'Lunch & Dinner', 'Italian Specialties', 22.95, false, 141),
  ('Meat Lasagna', NULL, 'Lunch & Dinner', 'Italian Specialties', 22.95, false, 142),
  ('Rigatoni & Chicken', 'With spinach & sundried tomato in garlic white wine sauce', 'Lunch & Dinner', 'Italian Specialties', 27.95, false, 143),
  ('Linguini Ala Ritz (Spicy or Mild)', 'Sautéed shrimp & clams in a divine diablo sauce over choice of pasta', 'Lunch & Dinner', 'Italian Specialties', 29.95, false, 144);

-- Jewish Specialties
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Potato Pancakes', 'With homemade applesauce and sour cream', 'Lunch & Dinner', 'Jewish Specialties', 15.95, false, 145),
  ('Kasha Varnishkas', 'In its natural gravy', 'Lunch & Dinner', 'Jewish Specialties', 15.95, false, 146),
  ('Stuffed Cabbage (Hungarian Style)', NULL, 'Lunch & Dinner', 'Jewish Specialties', 21.95, false, 147),
  ('Chicken in The Pot', 'Boiled chicken with matzoh balls, noodles and carrots', 'Lunch & Dinner', 'Jewish Specialties', 23.95, false, 148),
  ('Flanken in The Pot', 'Boiled flanken with matzoh balls, noodles and carrots', 'Lunch & Dinner', 'Jewish Specialties', 23.95, false, 149),
  ('Potato Pierogies', 'Sauteed in a pan with brown onions', 'Lunch & Dinner', 'Jewish Specialties', 17.95, false, 150),
  ('Sauteed Chicken Liver', 'With onions & mushrooms over rice with brown sauce', 'Lunch & Dinner', 'Jewish Specialties', 23.95, false, 151);

-- Refreshing Cold Platters & Salads
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Chunky Shrimp Salad', 'With hard-boiled egg, lettuce and fresh vegetables', 'Lunch & Dinner', 'Cold Platters & Salads', 22.95, false, 152),
  ('Chicken Salad Platter', 'With hard-boiled egg, lettuce and fresh vegetables', 'Lunch & Dinner', 'Cold Platters & Salads', 17.95, false, 153),
  ('Tuna Fish Salad Platter', 'With hard-boiled egg, lettuce and fresh vegetables', 'Lunch & Dinner', 'Cold Platters & Salads', 17.95, false, 154),
  ('Egg Salad Platter', 'With hard-boiled egg, lettuce and fresh vegetables', 'Lunch & Dinner', 'Cold Platters & Salads', 14.95, false, 155),
  ('Chopped Chicken Liver', 'With hard-boiled egg, bermuda onion and vegetable', 'Lunch & Dinner', 'Cold Platters & Salads', 15.95, false, 156),
  ('Greek Salad — Small', 'With dressing | Add Grilled Chicken $5.95', 'Lunch & Dinner', 'Cold Platters & Salads', 14.95, false, 157),
  ('Greek Salad — Large', 'With dressing | Add Grilled Chicken $5.95', 'Lunch & Dinner', 'Cold Platters & Salads', 17.95, false, 158),
  ('Tossed Salad', 'With Tuna or Chicken Salad $15.95. With Shrimp Salad $22.95.', 'Lunch & Dinner', 'Cold Platters & Salads', 6.95, false, 159),
  ('Spinach Salad', 'With fresh mushrooms, tomato, egg & bacon', 'Lunch & Dinner', 'Cold Platters & Salads', 16.95, false, 160),
  ('Grilled Chicken — Small', 'Over garden salad', 'Lunch & Dinner', 'Cold Platters & Salads', 15.95, false, 161),
  ('Grilled Chicken — Large', 'Over garden salad', 'Lunch & Dinner', 'Cold Platters & Salads', 17.95, false, 162),
  ('Chef''s Salad', 'With sliced turkey, roast beef, ham, Swiss cheese, hard-boiled egg, assorted greens and tomato wedges', 'Lunch & Dinner', 'Cold Platters & Salads', 18.95, false, 163),
  ('Sardine Platter', 'With fresh vegetables', 'Lunch & Dinner', 'Cold Platters & Salads', 14.95, false, 164);

-- Distinctive Specialties
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Caesar Salad', NULL, 'Lunch & Dinner', 'Distinctive Specialties', 13.95, false, 165),
  ('Char Grilled Chicken Over Caesar Salad — Lunch', NULL, 'Lunch & Dinner', 'Distinctive Specialties', 16.95, false, 166),
  ('Char Grilled Chicken Over Caesar Salad — Dinner', NULL, 'Lunch & Dinner', 'Distinctive Specialties', 21.95, false, 167),
  ('Cheese Steak Deluxe', 'On torpedo roll with fried onions and french fries', 'Lunch & Dinner', 'Distinctive Specialties', 15.95, false, 168),
  ('Grilled Chicken Pasta — Lunch', 'Over arugula, tomato, onion and cold pasta with balsamic', 'Lunch & Dinner', 'Distinctive Specialties', 14.95, false, 169),
  ('Grilled Chicken Pasta — Dinner', 'Over arugula, tomato, onion and cold pasta with balsamic', 'Lunch & Dinner', 'Distinctive Specialties', 23.95, false, 170),
  ('Char-Grilled Chicken Breast Sandwich', 'With lettuce & tomato on a bun or focaccia bread, served with french fries', 'Lunch & Dinner', 'Distinctive Specialties', 15.95, false, 171),
  ('Sesame Chicken — Lunch', 'With fresh mushrooms & tomatoes over spinach salad', 'Lunch & Dinner', 'Distinctive Specialties', 15.95, false, 172),
  ('Sesame Chicken — Dinner', 'With fresh mushrooms & tomatoes over spinach salad', 'Lunch & Dinner', 'Distinctive Specialties', 23.95, false, 173),
  ('Chicken Finger Platter', 'With french fries and honey mustard', 'Lunch & Dinner', 'Distinctive Specialties', 15.95, false, 174),
  ('Stir-Fried Fresh Vegetables', 'With soy sauce or garlic & olive oil', 'Lunch & Dinner', 'Distinctive Specialties', 17.95, false, 175),
  ('French Dip', 'On garlic bread, au jus served with french fries', 'Lunch & Dinner', 'Distinctive Specialties', 15.95, false, 176),
  ('Golden Fried Filet Deluxe', 'On a bun with french fries and cole slaw', 'Lunch & Dinner', 'Distinctive Specialties', 12.95, false, 177),
  ('Chicken Cheesesteak', 'On a torpedo roll with fried onions served with french fries', 'Lunch & Dinner', 'Distinctive Specialties', 16.95, false, 178),
  ('Turkey or Chicken Meatloaf Sandwich', 'With gravy on a hard roll served with french fries', 'Lunch & Dinner', 'Distinctive Specialties', 12.95, false, 179),
  ('Veal Patti Parmigiana', 'On torpedo roll', 'Lunch & Dinner', 'Distinctive Specialties', 14.95, false, 180),
  ('Tuna Melt', 'With cheese and tomatoes', 'Lunch & Dinner', 'Distinctive Specialties', 15.95, false, 181),
  ('Chicken Pot Pie', NULL, 'Lunch & Dinner', 'Distinctive Specialties', 18.95, false, 182),
  ('Beef Meatball Sandwich', 'Parmigiana $14.95', 'Lunch & Dinner', 'Distinctive Specialties', 12.95, false, 183),
  ('Eggplant Parmigiana Hero', NULL, 'Lunch & Dinner', 'Distinctive Specialties', 14.95, false, 184),
  ('Chicken Parmigiana Hero', 'Smothered in cheese on torpedo roll', 'Lunch & Dinner', 'Distinctive Specialties', 16.95, false, 185),
  ('Cuban Sandwich', 'Served with french fries', 'Lunch & Dinner', 'Distinctive Specialties', 13.95, false, 186),
  ('Gyro', 'Meat or Chicken on pita bread with lettuce, tomato, onion & tzatziki sauce, served with french fries', 'Lunch & Dinner', 'Distinctive Specialties', 15.95, false, 187),
  ('Chicken Wrap', 'Grilled chicken with lettuce, tomato & balsamic dressing, served with french fries', 'Lunch & Dinner', 'Distinctive Specialties', 15.95, false, 188),
  ('Chicken Quesadilla', 'Served with sour cream & salsa', 'Lunch & Dinner', 'Distinctive Specialties', 15.95, false, 189),
  ('Chili Fiesta', 'Bowl of homemade chili with chopped onion & sour cream', 'Lunch & Dinner', 'Distinctive Specialties', 10.95, false, 190);

-- Trim Line Features
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Hot Pasta Primavera', 'Mixed with low-fat cottage cheese and sauteed vegetables in garlic', 'Lunch & Dinner', 'Trim Line Features', 21.95, false, 191),
  ('Turkey Bowl', 'Large tossed salad topped with white meat turkey & hard boiled egg, choice of dressing', 'Lunch & Dinner', 'Trim Line Features', 18.95, false, 192),
  ('Lean Beef or Turkey Patti', 'With cottage cheese and pineapple', 'Lunch & Dinner', 'Trim Line Features', 14.95, false, 193),
  ('Diet Riot', 'Turkey or chicken burger with chopped tossed salad', 'Lunch & Dinner', 'Trim Line Features', 15.95, false, 194),
  ('Diet Delight', 'Veggie burger with chopped tossed salad', 'Lunch & Dinner', 'Trim Line Features', 15.95, false, 195),
  ('Pineapple Boat', 'Assorted fresh fruit and cottage cheese', 'Lunch & Dinner', 'Trim Line Features', 16.95, false, 196),
  ('Fresh Fruit Bowl', 'With lettuce, cottage cheese, and jello', 'Lunch & Dinner', 'Trim Line Features', 16.95, false, 197),
  ('Cobb Salad — Lunch', 'Grilled chicken, avocado, bacon, sliced egg, tomato & crumbled blue cheese in a crisp tortilla shell', 'Lunch & Dinner', 'Trim Line Features', 17.95, false, 198),
  ('Cobb Salad — Dinner', 'Grilled chicken, avocado, bacon, sliced egg, tomato & crumbled blue cheese in a crisp tortilla shell', 'Lunch & Dinner', 'Trim Line Features', 22.95, false, 199),
  ('Caesar Italia', 'Crisp romaine lettuce topped with grilled chicken, diced mozzarella, tomato, and onion', 'Lunch & Dinner', 'Trim Line Features', 18.95, false, 200),
  ('Marion’s Chopped Salad — Lunch', 'With sesame chicken, portabella mushrooms, iceberg lettuce, carrots, cucumbers, fresh mozzarella, and almonds with black olive dressing or a choice of dressing', 'Lunch & Dinner', 'Trim Line Features', 16.95, false, 201),
  ('Marion’s Chopped Salad — Dinner', 'With sesame chicken, portabella mushrooms, iceberg lettuce, carrots, cucumbers, fresh mozzarella, and almonds with black olive dressing or a choice of dressing', 'Lunch & Dinner', 'Trim Line Features', 22.95, false, 202),
  ('Ritz Salad with Grilled Chicken — Lunch', 'Iceberg Lettuce, Cucumbers, Carrots, Red Onion. Chick Peas, Olives & Fresh Mozzarella with Balsamic Vinaigrette Dressing', 'Lunch & Dinner', 'Trim Line Features', 16.95, false, 203),
  ('Ritz Salad with Grilled Chicken — Dinner', 'Iceberg Lettuce, Cucumbers, Carrots, Red Onion. Chick Peas, Olives & Fresh Mozzarella with Balsamic Vinaigrette Dressing', 'Lunch & Dinner', 'Trim Line Features', 22.95, false, 204),
  ('Blackened Salmon Salad', 'Blackened Salmon over Romaine Lettuce with Provolone Cheese, Tomatoes & Walnuts in a Lemon Vinaigrette Dressing', 'Lunch & Dinner', 'Trim Line Features', 33.30, false, 205);

-- From the Char-Broiler
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Steak Sandwich', 'Tender char-broiled skirt steak served on garlic bread, topped with sauteed onions, accompanied with french fries', 'Lunch & Dinner', 'From the Char-Broiler', 21.95, false, 206),
  ('Jumbo Burger — Regular', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 8.95, false, 207),
  ('Jumbo Burger — Deluxe', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 11.95, false, 208),
  ('Cheeseburger — Regular', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 9.95, false, 209),
  ('Cheeseburger — Deluxe', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 12.95, false, 210),
  ('Bacon Burger — Regular', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 10.95, false, 211),
  ('Bacon Burger — Deluxe', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 13.95, false, 212),
  ('Bacon Cheeseburger — Regular', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 11.95, false, 213),
  ('Bacon Cheeseburger — Deluxe', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 14.95, false, 214),
  ('Mushroom Burger — Regular', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 11.95, false, 215),
  ('Mushroom Burger — Deluxe', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 14.95, false, 216),
  ('Chili Burger — Regular', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 11.95, false, 217),
  ('Chili Burger — Deluxe', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 14.95, false, 218),
  ('Pizza Burger — Regular', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 11.95, false, 219),
  ('Pizza Burger — Deluxe', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 14.95, false, 220),
  ('Turkey or Veggie or Chicken Burger — Regular', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 11.95, false, 221),
  ('Turkey or Veggie or Chicken Burger — Deluxe', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 14.95, false, 222),
  ('Salmon Burger — Regular', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 13.95, false, 223),
  ('Salmon Burger — Deluxe', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 16.95, false, 224),
  ('Hot Dog (1/4 lb.)', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 6.95, false, 225),
  ('Chili Dog (1/4 lb.)', NULL, 'Lunch & Dinner', 'From the Char-Broiler', 8.95, false, 226);

-- Deli
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Hot Pastrami', NULL, 'Sandwiches & Deli', 'Deli', 14.95, false, 227),
  ('Hot Corned Beef', NULL, 'Sandwiches & Deli', 'Deli', 14.95, false, 228),
  ('Hot Brisket', NULL, 'Sandwiches & Deli', 'Deli', 14.95, false, 229),
  ('Corned Beef Reuben', 'With Swiss cheese, sauerkraut & Russian dressing', 'Sandwiches & Deli', 'Deli', 15.95, false, 230),
  ('Pastrami Reuben', 'With Swiss cheese, sauerkraut & Russian dressing', 'Sandwiches & Deli', 'Deli', 15.95, false, 231),
  ('Turkey Reuben', 'With Swiss cheese, cole slaw & Russian dressing', 'Sandwiches & Deli', 'Deli', 15.95, false, 232),
  ('Corned Beef & Pastrami', 'With cole slaw & Russian dressing', 'Sandwiches & Deli', 'Deli', 15.95, false, 233),
  ('Roast Beef', NULL, 'Sandwiches & Deli', 'Deli', 14.95, false, 234),
  ('Turkey', NULL, 'Sandwiches & Deli', 'Deli', 14.95, false, 235),
  ('Salami', NULL, 'Sandwiches & Deli', 'Deli', 12.95, false, 236),
  ('Ham', NULL, 'Sandwiches & Deli', 'Deli', 12.95, false, 237),
  ('Chopped Liver', NULL, 'Sandwiches & Deli', 'Deli', 12.95, false, 238),
  ('Ham & Cheese', NULL, 'Sandwiches & Deli', 'Deli', 11.95, false, 239),
  ('Corned Beef & Chopped Liver', 'With cole slaw & Russian dressing', 'Sandwiches & Deli', 'Deli', 15.95, false, 240),
  ('Turkey, Chopped Liver & Onion', 'With cole slaw & Russian dressing', 'Sandwiches & Deli', 'Deli', 15.95, false, 241),
  ('Turkey & Swiss Cheese', 'With cole slaw & Russian dressing', 'Sandwiches & Deli', 'Deli', 15.95, false, 242),
  ('Hot Pastrami or Corned Beef', 'Between our potato pancakes, side of horseradish', 'Sandwiches & Deli', 'Deli', 17.95, false, 243),
  ('Braised Brisket of Beef', 'Between two potato pancakes, side of homemade applesauce', 'Sandwiches & Deli', 'Deli', 17.95, false, 244);

-- Sandwiches
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Tuna Salad', NULL, 'Sandwiches & Deli', 'Sandwiches', 12.95, false, 245),
  ('Chicken Salad', NULL, 'Sandwiches & Deli', 'Sandwiches', 12.95, false, 246),
  ('Egg Salad', NULL, 'Sandwiches & Deli', 'Sandwiches', 8.95, false, 247),
  ('Chunky Shrimp Salad', NULL, 'Sandwiches & Deli', 'Sandwiches', 19.95, false, 248),
  ('Individual Tuna', NULL, 'Sandwiches & Deli', 'Sandwiches', 12.95, false, 249),
  ('Individual Salmon', NULL, 'Sandwiches & Deli', 'Sandwiches', 13.95, false, 250),
  ('Bacon, Lettuce & Tomato', NULL, 'Sandwiches & Deli', 'Sandwiches', 9.95, false, 251),
  ('American Cheese', NULL, 'Sandwiches & Deli', 'Sandwiches', 8.95, false, 252),
  ('Imported Swiss Cheese', NULL, 'Sandwiches & Deli', 'Sandwiches', 8.95, false, 253),
  ('Sardine Sandwich', NULL, 'Sandwiches & Deli', 'Sandwiches', 10.95, false, 254),
  ('Lettuce & Tomato Sandwich', NULL, 'Sandwiches & Deli', 'Sandwiches', 6.95, false, 255),
  ('Grilled American or Swiss Cheese', 'With Tomato $9.95, With Bacon or Ham $10.95, With Taylor Ham $10.95, With Bacon & Tomato $11.95', 'Sandwiches & Deli', 'Sandwiches', 8.95, false, 256);

-- Hot Open Sandwiches
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Open-Faced Hot Turkey Sandwich', 'With gravy and french fries', 'Sandwiches & Deli', 'Hot Open Sandwiches', 20.95, false, 257),
  ('Open-Faced Hot Roast Beef Sandwich', 'With gravy and french fries', 'Sandwiches & Deli', 'Hot Open Sandwiches', 20.95, false, 258),
  ('Open-Faced Brisket of Beef', 'With gravy and french fries', 'Sandwiches & Deli', 'Hot Open Sandwiches', 20.95, false, 259);

-- Triple Decker Sandwiches
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Club: Sliced Turkey, Bacon, Lettuce & Tomato', NULL, 'Sandwiches & Deli', 'Triple Decker Sandwiches', 15.95, false, 260),
  ('Tuna Fish Salad, Sliced Egg, Lettuce & Tomato', NULL, 'Sandwiches & Deli', 'Triple Decker Sandwiches', 14.95, false, 261),
  ('Chicken Salad, Bacon, Lettuce & Tomato', NULL, 'Sandwiches & Deli', 'Triple Decker Sandwiches', 14.95, false, 262),
  ('Egg Salad, Bacon, Lettuce & Tomato', NULL, 'Sandwiches & Deli', 'Triple Decker Sandwiches', 13.95, false, 263),
  ('Roast Beef, Imported Swiss Cheese, Lettuce & Tomato', NULL, 'Sandwiches & Deli', 'Triple Decker Sandwiches', 15.95, false, 264),
  ('Ham, Imported Swiss Cheese, Lettuce & Tomato', NULL, 'Sandwiches & Deli', 'Triple Decker Sandwiches', 14.95, false, 265),
  ('Chopped Chicken Liver, Bacon, Lettuce & Tomato', NULL, 'Sandwiches & Deli', 'Triple Decker Sandwiches', 13.95, false, 266),
  ('Chunky Shrimp Salad, Bacon, Lettuce, Tomato & Mayonnaise', NULL, 'Sandwiches & Deli', 'Triple Decker Sandwiches', 21.95, false, 267),
  ('Grilled Chicken Club with Bacon, Lettuce & Tomato', NULL, 'Sandwiches & Deli', 'Triple Decker Sandwiches', 16.95, false, 268),
  ('Hamburger Club with Bacon, Lettuce & Tomato', NULL, 'Sandwiches & Deli', 'Triple Decker Sandwiches', 14.95, false, 269);

-- Side Orders
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Homemade Potato Salad or Homemade Cole Slaw', NULL, 'Sides & Sweets', 'Side Orders', 4.95, false, 270),
  ('Side of Pasta', NULL, 'Sides & Sweets', 'Side Orders', 6.95, false, 271),
  ('Homemade Mashed Potatoes', NULL, 'Sides & Sweets', 'Side Orders', 5.95, false, 272),
  ('French Fries', 'With Gravy $6.50, with Cheese $7.00, with Cheese & Gravy $7.95', 'Sides & Sweets', 'Side Orders', 5.95, false, 273),
  ('Baked Potato', NULL, 'Sides & Sweets', 'Side Orders', 4.95, false, 274),
  ('Home Fries', NULL, 'Sides & Sweets', 'Side Orders', 5.95, false, 275),
  ('Side of Rice', NULL, 'Sides & Sweets', 'Side Orders', 4.95, false, 276),
  ('Onion Rings', NULL, 'Sides & Sweets', 'Side Orders', 7.95, false, 277),
  ('Ala Carte Vegetables', NULL, 'Sides & Sweets', 'Side Orders', 4.95, false, 278),
  ('Health Salad', NULL, 'Sides & Sweets', 'Side Orders', 4.95, false, 279),
  ('Pita', NULL, 'Sides & Sweets', 'Side Orders', 1.95, false, 280),
  ('Cottage Cheese', NULL, 'Sides & Sweets', 'Side Orders', 4.95, false, 281),
  ('Souffle of Cottage Cheese', NULL, 'Sides & Sweets', 'Side Orders', 1.95, false, 282),
  ('Feta Cheese', NULL, 'Sides & Sweets', 'Side Orders', 5.95, false, 283),
  ('Homemade Applesauce', NULL, 'Sides & Sweets', 'Side Orders', 4.95, false, 284),
  ('Meatball (each)', NULL, 'Sides & Sweets', 'Side Orders', 5.95, false, 285),
  ('Sausage (Pork or Turkey)', NULL, 'Sides & Sweets', 'Side Orders', 5.95, false, 286),
  ('Bacon, Ham, or Taylor Ham', NULL, 'Sides & Sweets', 'Side Orders', 5.95, false, 287),
  ('Canadian Bacon', NULL, 'Sides & Sweets', 'Side Orders', 6.25, false, 288),
  ('Turkey Bacon', NULL, 'Sides & Sweets', 'Side Orders', 6.95, false, 289),
  ('Corned Beef Hash', NULL, 'Sides & Sweets', 'Side Orders', 7.95, false, 290),
  ('Hard Roll with Butter', NULL, 'Sides & Sweets', 'Side Orders', 2.95, false, 291),
  ('Toast with Butter & Jelly', NULL, 'Sides & Sweets', 'Side Orders', 2.75, false, 292),
  ('English Muffin with Butter & Jelly', NULL, 'Sides & Sweets', 'Side Orders', 2.95, false, 293),
  ('Blueberry Muffin or Apple Cinnamon Muffin', NULL, 'Sides & Sweets', 'Side Orders', 4.75, false, 294),
  ('Chocolate Chip Muffin', NULL, 'Sides & Sweets', 'Side Orders', 4.75, false, 295),
  ('Corn or Bran Muffin', NULL, 'Sides & Sweets', 'Side Orders', 4.75, false, 296);

-- Homemade Desserts
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Country Style Apple Pie', NULL, 'Sides & Sweets', 'Homemade Desserts', 5.50, false, 297),
  ('Sugar Free Apple Pie', NULL, 'Sides & Sweets', 'Homemade Desserts', 5.50, false, 298),
  ('Cheesecake', NULL, 'Sides & Sweets', 'Homemade Desserts', 5.95, false, 299),
  ('Sugar Free Cheesecake', NULL, 'Sides & Sweets', 'Homemade Desserts', 6.95, false, 300),
  ('Strawberry Cheesecake', NULL, 'Sides & Sweets', 'Homemade Desserts', 6.75, false, 301),
  ('Apple, Cherry or Blueberry Crumb Pie', NULL, 'Sides & Sweets', 'Homemade Desserts', 5.75, false, 302),
  ('Lemon Meringue Pie', NULL, 'Sides & Sweets', 'Homemade Desserts', 5.75, false, 303),
  ('Blackout Cake', NULL, 'Sides & Sweets', 'Homemade Desserts', 5.75, false, 304),
  ('Chocolate Cake', NULL, 'Sides & Sweets', 'Homemade Desserts', 5.75, false, 305),
  ('Seven Layer Cake', NULL, 'Sides & Sweets', 'Homemade Desserts', 5.75, false, 306),
  ('Carrot Cake', NULL, 'Sides & Sweets', 'Homemade Desserts', 5.75, false, 307),
  ('Pound Cake', NULL, 'Sides & Sweets', 'Homemade Desserts', 3.95, false, 308),
  ('Apple Turnover', NULL, 'Sides & Sweets', 'Homemade Desserts', 4.95, false, 309),
  ('Cannoli', NULL, 'Sides & Sweets', 'Homemade Desserts', 4.95, false, 310),
  ('Linzer Tart', NULL, 'Sides & Sweets', 'Homemade Desserts', 3.95, false, 311),
  ('Danish', NULL, 'Sides & Sweets', 'Homemade Desserts', 3.95, false, 312),
  ('Almond Horn', NULL, 'Sides & Sweets', 'Homemade Desserts', 5.50, false, 313),
  ('Hamantaschen', NULL, 'Sides & Sweets', 'Homemade Desserts', 4.95, false, 314),
  ('Assorted Strudels', NULL, 'Sides & Sweets', 'Homemade Desserts', 5.95, false, 315),
  ('Babka', NULL, 'Sides & Sweets', 'Homemade Desserts', 5.95, false, 316),
  ('Chocolate Babka', NULL, 'Sides & Sweets', 'Homemade Desserts', 5.95, false, 317),
  ('Brownie', NULL, 'Sides & Sweets', 'Homemade Desserts', 3.95, false, 318),
  ('Rice Pudding', NULL, 'Sides & Sweets', 'Homemade Desserts', 4.75, false, 319),
  ('Bread Pudding', NULL, 'Sides & Sweets', 'Homemade Desserts', 6.95, false, 320),
  ('Jello with Whipped Topping', NULL, 'Sides & Sweets', 'Homemade Desserts', 3.50, false, 321),
  ('Fresh Strawberries', NULL, 'Sides & Sweets', 'Homemade Desserts', 6.95, false, 322),
  ('Chocolate Chip Cookie', NULL, 'Sides & Sweets', 'Homemade Desserts', 3.95, false, 323),
  ('Black & White Cookie', NULL, 'Sides & Sweets', 'Homemade Desserts', 3.95, false, 324),
  ('Eclair', NULL, 'Sides & Sweets', 'Homemade Desserts', 3.95, false, 325);

-- Kids Korner
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Hamburger or Grilled Chicken Sandwich', NULL, 'Kids', 'Kids Korner', 10.95, false, 326),
  ('Chicken Fingers', NULL, 'Kids', 'Kids Korner', 10.65, false, 327),
  ('Fried Chicken Nuggets', NULL, 'Kids', 'Kids Korner', 10.25, false, 328),
  ('Grilled Hot Dog', NULL, 'Kids', 'Kids Korner', 8.95, false, 329),
  ('Cheeseburger', NULL, 'Kids', 'Kids Korner', 11.50, false, 330),
  ('Fried Fish', NULL, 'Kids', 'Kids Korner', 9.95, false, 331),
  ('Spaghetti & Meatball (Complete)', NULL, 'Kids', 'Kids Korner', 9.95, false, 332),
  ('Macaroni & Cheese (Complete)', NULL, 'Kids', 'Kids Korner', 9.95, false, 333),
  ('Grilled Cheese or Peanut Butter & Jelly', NULL, 'Kids', 'Kids Korner', 8.95, false, 334);

-- Breakfast - Eggs
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Two Eggs (Any Style)', 'With Bacon, Ham, or Sausage (Pork or Turkey) $11.95, With Taylor Ham $11.95', 'Breakfast', 'Eggs', 7.95, false, 335),
  ('Single Egg', 'With Bacon, Ham, or Sausage (Pork or Turkey) $9.95, With Taylor Ham $9.95', 'Breakfast', 'Eggs', 6.95, false, 336),
  ('Sliced Steak & Eggs', NULL, 'Breakfast', 'Eggs', 24.95, false, 337),
  ('Corned Beef Hash with Two Eggs', NULL, 'Breakfast', 'Eggs', 13.95, false, 338),
  ('Eggs Benedict', 'Served with home fries', 'Breakfast', 'Eggs', 15.95, false, 339),
  ('Homemade Blintzes', 'Cheese blintzes with a souffle of blueberry and sour cream', 'Breakfast', 'Eggs', 16.95, false, 340),
  ('Oatmeal — Cup', NULL, 'Breakfast', 'Eggs', 3.95, false, 341),
  ('Oatmeal — Bowl', NULL, 'Breakfast', 'Eggs', 4.50, false, 342);

-- Breakfast - Egg Sandwiches
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Egg Sandwich', NULL, 'Breakfast', 'Egg Sandwiches', 6.95, false, 343),
  ('Egg & Cheese', NULL, 'Breakfast', 'Egg Sandwiches', 7.95, false, 344),
  ('Taylor Ham Sandwich', NULL, 'Breakfast', 'Egg Sandwiches', 8.95, false, 345),
  ('Ham or Bacon or Salami or Sausage & Egg', NULL, 'Breakfast', 'Egg Sandwiches', 9.50, false, 346),
  ('Western', NULL, 'Breakfast', 'Egg Sandwiches', 9.50, false, 347),
  ('Taylor Ham & Cheese', NULL, 'Breakfast', 'Egg Sandwiches', 9.95, false, 348),
  ('Taylor Ham & Egg', NULL, 'Breakfast', 'Egg Sandwiches', 9.50, false, 349),
  ('Taylor Ham, Egg & Cheese', NULL, 'Breakfast', 'Egg Sandwiches', 10.50, false, 350),
  ('Mixed Deli', NULL, 'Breakfast', 'Egg Sandwiches', 11.95, false, 351),
  ('Avocado Toast Platter', 'With two eggs any style, served with home fries or vegetables', 'Breakfast', 'Egg Sandwiches', 17.25, false, 352),
  ('Μatzon Brei', 'Pancake style, served with our homemade applesauce and sour cream', 'Breakfast', 'Egg Sandwiches', 15.95, false, 353),
  ('Challah French Toast (Plain or Raisin)', NULL, 'Breakfast', 'Egg Sandwiches', 12.95, false, 354);

-- Breakfast - Omelettes
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Plain', NULL, 'Breakfast', 'Omelettes', 8.95, false, 355),
  ('American Cheese', NULL, 'Breakfast', 'Omelettes', 10.95, false, 356),
  ('Imported Swiss Cheese', NULL, 'Breakfast', 'Omelettes', 10.95, false, 357),
  ('Cheddar Cheese', NULL, 'Breakfast', 'Omelettes', 10.95, false, 358),
  ('Ham & Cheese', NULL, 'Breakfast', 'Omelettes', 12.95, false, 359),
  ('Turkey', NULL, 'Breakfast', 'Omelettes', 14.95, false, 360),
  ('Bacon or Ham', NULL, 'Breakfast', 'Omelettes', 12.95, false, 361),
  ('Spanish', NULL, 'Breakfast', 'Omelettes', 11.95, false, 362),
  ('Feta & Tomato', NULL, 'Breakfast', 'Omelettes', 12.95, false, 363),
  ('Salami & Eggs (Pancake Style)', NULL, 'Breakfast', 'Omelettes', 13.95, false, 364),
  ('Sausage', NULL, 'Breakfast', 'Omelettes', 12.95, false, 365),
  ('Onion', NULL, 'Breakfast', 'Omelettes', 9.95, false, 366),
  ('Fresh Mushrooms', NULL, 'Breakfast', 'Omelettes', 13.95, false, 367),
  ('Chicken Liver', 'With fresh mushrooms & onions', 'Breakfast', 'Omelettes', 16.95, false, 368),
  ('Nova & Onion', NULL, 'Breakfast', 'Omelettes', 16.95, false, 369),
  ('Mixed Deli', NULL, 'Breakfast', 'Omelettes', 16.95, false, 370),
  ('Western', NULL, 'Breakfast', 'Omelettes', 11.95, false, 371),
  ('Spinach', NULL, 'Breakfast', 'Omelettes', 11.95, false, 372),
  ('Broccoli', NULL, 'Breakfast', 'Omelettes', 11.95, false, 373),
  ('Scallion & Cream Cheese', NULL, 'Breakfast', 'Omelettes', 11.95, false, 374),
  ('Farmer''s Omelette', 'With broccoli, mushrooms, onions, tomatoes, and green peppers', 'Breakfast', 'Omelettes', 13.95, false, 375),
  ('Italian Omelette', 'With sausage, peppers, mozzarella, and mushrooms', 'Breakfast', 'Omelettes', 13.95, false, 376);

-- Breakfast - From the Griddle
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('German Apple Pancake', 'Breathtaking open crepe with fresh apples & cinnamon sugar', 'Breakfast', 'From the Griddle', 16.95, false, 377),
  ('Buttermilk Pancakes', 'With Ham, Bacon, Sausage, or Taylor Ham $12.50', 'Breakfast', 'From the Griddle', 9.50, false, 378),
  ('Blueberry Pancakes', 'With Ham, Bacon, Sausage, or Taylor Ham $14.50. Short Stack $9.95', 'Breakfast', 'From the Griddle', 11.95, false, 379),
  ('Chocolate Chip Pancakes', 'Short Stack $9.95', 'Breakfast', 'From the Griddle', 12.50, false, 380),
  ('Short Stack of Pancakes', NULL, 'Breakfast', 'From the Griddle', 7.95, false, 381),
  ('Silver Dollars', NULL, 'Breakfast', 'From the Griddle', 8.95, false, 382),
  ('French Toast', NULL, 'Breakfast', 'From the Griddle', 9.95, false, 383),
  ('Belgian Waffle', 'With Strawberries $11.95', 'Breakfast', 'From the Griddle', 9.95, false, 384);

-- Breakfast - Bagel Bin
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Toasted Bagel with Butter & Jelly', NULL, 'Breakfast', 'Bagel Bin', 3.75, false, 385),
  ('Toasted Bagel with Cream Cheese', NULL, 'Breakfast', 'Bagel Bin', 5.25, false, 386),
  ('Nova Platter', 'Served with Toasted Bagel, Cream Cheese, Lettuce, Tomato, Bermuda Onion & Cucumbers', 'Breakfast', 'Bagel Bin', 17.95, false, 387),
  ('Smoked Whitefish Platter', 'Served with Toasted Bagel, Cream Cheese, Lettuce, Tomato, Bermuda Onion & Cucumbers', 'Breakfast', 'Bagel Bin', 17.95, false, 388),
  ('Smoked Whitefish Salad Platter', 'Served with Toasted Bagel, Cream Cheese, Lettuce, Tomato, Bermuda Onion & Cucumbers', 'Breakfast', 'Bagel Bin', 15.95, false, 389);

-- Drinks - Beverages
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Fresh Ground Coffee (Regular or Decaf)', NULL, 'Drinks & Ice Cream', 'Beverages', 3.00, false, 390),
  ('Coffee To Go — Small', NULL, 'Drinks & Ice Cream', 'Beverages', 3.00, false, 391),
  ('Coffee To Go — Large', NULL, 'Drinks & Ice Cream', 'Beverages', 3.50, false, 392),
  ('Tea', NULL, 'Drinks & Ice Cream', 'Beverages', 2.95, false, 393),
  ('Herbal Tea', NULL, 'Drinks & Ice Cream', 'Beverages', 3.50, false, 394),
  ('Hot Chocolate with Whipped Topping', NULL, 'Drinks & Ice Cream', 'Beverages', 3.95, false, 395),
  ('Fresh Squeezed Orange Juice — Small', NULL, 'Drinks & Ice Cream', 'Beverages', 3.00, false, 396),
  ('Fresh Squeezed Orange Juice — Large', NULL, 'Drinks & Ice Cream', 'Beverages', 5.00, false, 397),
  ('Grapefruit Juice — Small', NULL, 'Drinks & Ice Cream', 'Beverages', 3.00, false, 398),
  ('Grapefruit Juice — Large', NULL, 'Drinks & Ice Cream', 'Beverages', 5.00, false, 399),
  ('Apple Juice — Small', NULL, 'Drinks & Ice Cream', 'Beverages', 3.00, false, 400),
  ('Apple Juice — Large', NULL, 'Drinks & Ice Cream', 'Beverages', 5.00, false, 401),
  ('Cranberry Juice — Small', NULL, 'Drinks & Ice Cream', 'Beverages', 3.00, false, 402),
  ('Cranberry Juice — Large', NULL, 'Drinks & Ice Cream', 'Beverages', 5.00, false, 403),
  ('Pineapple Juice — Small', NULL, 'Drinks & Ice Cream', 'Beverages', 3.00, false, 404),
  ('Pineapple Juice — Large', NULL, 'Drinks & Ice Cream', 'Beverages', 5.00, false, 405),
  ('Tomato Juice — Small', NULL, 'Drinks & Ice Cream', 'Beverages', 3.00, false, 406),
  ('Tomato Juice — Large', NULL, 'Drinks & Ice Cream', 'Beverages', 5.00, false, 407),
  ('Milk or Skim Milk — Small', NULL, 'Drinks & Ice Cream', 'Beverages', 3.25, false, 408),
  ('Milk or Skim Milk — Large', NULL, 'Drinks & Ice Cream', 'Beverages', 4.50, false, 409),
  ('Chocolate Milk — Small', NULL, 'Drinks & Ice Cream', 'Beverages', 3.50, false, 410),
  ('Chocolate Milk — Large', NULL, 'Drinks & Ice Cream', 'Beverages', 5.00, false, 411),
  ('Iced Tea', NULL, 'Drinks & Ice Cream', 'Beverages', 3.75, false, 412),
  ('Iced Coffee or Iced Decaffeinated', NULL, 'Drinks & Ice Cream', 'Beverages', 3.75, false, 413),
  ('Pepsi', NULL, 'Drinks & Ice Cream', 'Beverages', 3.50, false, 414),
  ('Diet Pepsi', NULL, 'Drinks & Ice Cream', 'Beverages', 3.50, false, 415),
  ('Sierra Mist', NULL, 'Drinks & Ice Cream', 'Beverages', 3.50, false, 416),
  ('Lemonade', NULL, 'Drinks & Ice Cream', 'Beverages', 3.50, false, 417),
  ('Tropicana Orange Twister', NULL, 'Drinks & Ice Cream', 'Beverages', 3.50, false, 418),
  ('Mug Root Beer', NULL, 'Drinks & Ice Cream', 'Beverages', 3.50, false, 419),
  ('No-Salt Seltzer', NULL, 'Drinks & Ice Cream', 'Beverages', 1.55, false, 420),
  ('Bottled Water', NULL, 'Drinks & Ice Cream', 'Beverages', 2.50, false, 421),
  ('Orange Juice To-Go — 10 oz.', NULL, 'Drinks & Ice Cream', 'Beverages', 5.50, false, 422),
  ('Orange Juice To-Go — 16 oz.', NULL, 'Drinks & Ice Cream', 'Beverages', 6.95, false, 423);

-- Shakes, Sundaes & Ice Cream
INSERT INTO seed_menu_items (
  name,
  description,
  group_name,
  category,
  price,
  is_special,
  sort_order
)
VALUES
  ('Old Fashioned Shake', 'Extra Thick $7.95', 'Drinks & Ice Cream', 'Shakes, Sundaes & Ice Cream', 6.95, false, 424),
  ('Traditional Ice Cream Soda', NULL, 'Drinks & Ice Cream', 'Shakes, Sundaes & Ice Cream', 6.95, false, 425),
  ('Delicious Ice Cream Sundae', NULL, 'Drinks & Ice Cream', 'Shakes, Sundaes & Ice Cream', 7.95, false, 426),
  ('Dish of Ice Cream (Chocolate, Vanilla or Strawberry)', NULL, 'Drinks & Ice Cream', 'Shakes, Sundaes & Ice Cream', 5.25, false, 427);

-- Resolve the staged human-readable taxonomy to stable category IDs.

INSERT INTO menu_items (
  name,
  description,
  category_id,
  price,
  is_special,
  sort_order
)
SELECT
  staged.name,
  staged.description,
  categories.id,
  staged.price,
  staged.is_special,
  staged.sort_order
FROM seed_menu_items AS staged
JOIN menu_groups AS groups
  ON groups.name = staged.group_name
JOIN menu_categories AS categories
  ON categories.group_id = groups.id
 AND categories.name = staged.category
ORDER BY staged.sort_order;

DO $$
BEGIN
  IF (
    SELECT count(*)
    FROM menu_items
  ) <> 427 THEN
    RAISE EXCEPTION
      'Expected 427 menu items after seed';
  END IF;
END
$$;

SELECT seed_lazy_janes_modifiers();
