/* eslint-disable camelcase */
exports.up = pgm => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        is_delete: {
            type: 'BOOLEAN',
            default: false,
        },
        date: {
            type: 'TIMESTAMPTZ',
            notNull: true,
        },
        thread_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
    });

    pgm.addConstraint('comments', 'fk_comments.thread_id_threads', 'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE');
    pgm.addConstraint('comments', 'fk_comments.owner_users', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropTable('comments');
};
