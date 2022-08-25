-- migrate:up
CREATE TABLE users (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  nickname VARCHAR(50) NULL,
  password VARCHAR(300) NOT NULL,
  profile_image VARCHAR(3000) NULL,
  created_at DATETIME NOT NULL DEFAULT now()
);

-- migrate:down
DROP TABLE users;