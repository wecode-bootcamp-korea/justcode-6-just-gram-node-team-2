-- migrate:up
CREATE TABLE comments (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  comment VARCHAR(2000) NULL,
  posting_id int NOT NULL,
  user_id INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT now(),
  CONSTRAINT fk_comments_posting_id FOREIGN KEY (posting_id) REFERENCES postings (id),
  CONSTRAINT fk_comments_user_id FOREIGN KEY (user_id) REFERENCES users(id)
);

-- migrate:down
DROP TABLE comments;
