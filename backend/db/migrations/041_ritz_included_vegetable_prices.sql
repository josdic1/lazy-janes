BEGIN;

-- Confirmed Ritz menu truth: One Vegetable / Two Vegetables and the
-- vegetables they activate are included choices, not pending-price add-ons.
UPDATE menu_choice_options option_record
SET
  price_adjustment = 0,
  price_adjustment_configured = true,
  updated_at = now()
FROM menu_choice_groups group_record
WHERE option_record.choice_group_id = group_record.id
  AND group_record.is_active = true
  AND option_record.is_active = true
  AND (
    EXISTS (
      SELECT 1
      FROM menu_choice_constraints constraint_record
      WHERE constraint_record.source_choice_option_id = option_record.id
        AND constraint_record.is_active = true
        AND lower(option_record.label) IN ('one vegetable', 'two vegetables')
    )
    OR
    EXISTS (
      SELECT 1
      FROM menu_choice_constraints constraint_record
      WHERE constraint_record.target_choice_group_id = group_record.id
        AND constraint_record.is_active = true
        AND lower(group_record.label) = 'vegetables'
        AND lower(option_record.label) IN (
          'carrots',
          'broccoli',
          'zucchini',
          'brussels sprouts'
        )
    )
  );

COMMIT;
