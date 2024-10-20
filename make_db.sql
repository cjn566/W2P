-- Create the 'users' table
CREATE TABLE app.users (
    name_slug VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    image VARCHAR(255),
    created_by VARCHAR(255),
    modified_by VARCHAR(255),
    set_private BOOLEAN DEFAULT FALSE,
    bgg_username VARCHAR(255),
    default_collection_id INTEGER,
    PRIMARY KEY (email)
);

-- Create the 'collections' table
CREATE TABLE app.collections (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    collection_name VARCHAR(255),
    created_by VARCHAR(255),
    modified_by VARCHAR(255),
    FOREIGN KEY (user_email) REFERENCES app.users (email) ON DELETE CASCADE
);

-- Add index on user_email for faster queries on collections
CREATE INDEX idx_collections_user_email ON app.collections (user_email);

-- Create the 'games' table
CREATE TABLE app.games (
    id SERIAL PRIMARY KEY,
    bgg_game_id INTEGER,
    created_by VARCHAR(255),
    collection_id INTEGER,
    FOREIGN KEY (collection_id) REFERENCES app.collections (id) ON DELETE CASCADE
);

-- Create the 'bgg_game_data' table
CREATE TABLE app.bgg_game_data (
    bgg_game_id INTEGER PRIMARY KEY,
    data VARCHAR(10000),
    modified_timestamp TIMESTAMP WITHOUT TIME ZONE
);

-- Create the 'friends' table
CREATE TABLE app.friends (
    user_1 VARCHAR(255) NOT NULL,
    user_2 VARCHAR(255) NOT NULL,
    status VARCHAR(50),
    PRIMARY KEY (user_1, user_2),
    FOREIGN KEY (user_1) REFERENCES app.users (email) ON DELETE CASCADE,
    FOREIGN KEY (user_2) REFERENCES app.users (email) ON DELETE CASCADE
);

-- Create the 'friend_request_status_options' table
CREATE TABLE app.friend_request_status_options (
    option VARCHAR(50) PRIMARY KEY
);

-- Create the 'logs.levels' table
CREATE TABLE logs.levels (
    level VARCHAR(20) PRIMARY KEY
);

-- Create the 'logs.entries' table
CREATE TABLE logs.entries (
    id SERIAL PRIMARY KEY,
    timestamp TIMESTAMP WITHOUT TIME ZONE,
    level VARCHAR(20),
    source VARCHAR(100),
    message TEXT,
    context JSONB,
    FOREIGN KEY (level) REFERENCES logs.levels (level)
);

-- Add Foreign Key to relate default collection to users
ALTER TABLE app.users
    ADD CONSTRAINT fk_default_collection
    FOREIGN KEY (default_collection_id)
    REFERENCES app.collections (id) ON DELETE SET NULL;
