// Create and Save a new Note
export function create(req, res) {
    // Validate request
    if (!req.body.content) {
        return send400(res, "Note content can not be empty")
    }

    // Create a Note
    const note = new Note({
        title: req.body.title || "Untitled Note",
        content: req.body.content
    });

    // Save Note in the database
    note.save()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while creating the Note."
            });
        });
}

// Retrieve and return all notes from the database.
export function findAll(req, res) {
    Note.find()
        .then(notes => {
            res.send(notes);
        }).catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving notes."
            });
        });
}

// Find a single note with a noteId
export function findOne(req, res) {
    Note.findById(req.params.noteId)
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send(note);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "Error retrieving note with id " + req.params.noteId
            });
        });
}

// Update a note identified by the noteId in the request
export function update(req, res) {
    if (!req.body.content) {
        return send400(res, "Note content can not be empty")
    }

    // Find note and update it with the request body
    Note.findByIdAndUpdate(req.params.noteId, {
            title: req.body.title || "Untitled Note",
            content: req.body.content
        }, {
            new: true
        })
        .then(note => {
            if (!note) {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            res.send(note);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Note not found with id " + req.params.noteId
                });
            }
            return res.status(500).send({
                message: "Error updating note with id " + req.params.noteId
            });
        });
}

// Delete a note with the specified noteId in the request
const _delete = (req, res) => {};
export {
    _delete as delete
};