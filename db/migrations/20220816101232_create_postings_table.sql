-- migrate:up
CREATE TABLE postings (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  contents VARCHAR(2000) NULL,
  created_at DATETIME NOT NULL DEFAULT now(),
  CONSTRAINT fk_posting_user_id FOREIGN KEY (user_id) REFERENCES users (id)
);

-- migrate:down
DROP TABLE postings;
