DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY NOT NULL,
    surname VARCHAR(255) NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    email_id VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    UNIQUE (email_id),
    created_at TIMESTAMPTZ DEFAULT now()
);

DROP TABLE IF EXISTS schedules;

CREATE TABLE schedules (
    schedule_id SERIAL PRIMARY KEY NOT NULL,
    user_id INT NOT NULL,
    day INT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT fk_user
        FOREIGN KEY(user_id)
            REFERENCES users(user_id)
                ON DELETE CASCADE
);