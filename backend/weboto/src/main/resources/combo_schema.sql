-- Create combos table
-- Holds the master record for each product bundle
CREATE TABLE IF NOT EXISTS combos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255),
    discount_type VARCHAR(50) NOT NULL, -- e.g., 'PERCENT' or 'AMOUNT'
    discount_value DECIMAL(19, 2) NOT NULL,
    active TINYINT(1) NOT NULL DEFAULT 1 -- Boolean: 1 for active, 0 for hidden
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create combo_items join table
-- Maps multiple parts to each combo with specific quantities
CREATE TABLE IF NOT EXISTS combo_items (
    combo_id INT NOT NULL,
    part_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    sort_order INT NOT NULL DEFAULT 0,
    PRIMARY KEY (combo_id, part_id),
    CONSTRAINT fk_combo_item_combo FOREIGN KEY (combo_id)
        REFERENCES combos (id)
        ON DELETE CASCADE, -- Delete items if the combo is deleted
    CONSTRAINT fk_combo_item_part FOREIGN KEY (part_id)
        REFERENCES parts (id)
        ON DELETE CASCADE  -- Delete items if the individual part is deleted
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
