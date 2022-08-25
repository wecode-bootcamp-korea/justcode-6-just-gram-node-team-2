-- migrate:up
CREATE TABLE posting_images (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  posting_id INT NOT NULL,
  image_url VARCHAR(3000) NULL,
  created_at DATETIME NOT NULL DEFAULT now(),
  CONSTRAINT fk_posting_images_posing_id FOREIGN KEY (posting_id) REFERENCES postings (id)
);

-- migrate:down
DROP TABLE posting_images;
