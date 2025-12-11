from flask_socketio import SocketIO

socketio = SocketIO()

def initialize_socketio(app):
    socketio.init_app(app)

    @socketio.on("connect")
    def on_connect():
        print("Client connected")

    @socketio.on("disconnect")
    def on_disconnect():
        print("Client disconnected")

    @socketio.on("job_search")
    def on_job_search():
        # Call function to search and process jobs
        listings = search_jobs()
        filtered_listings = parse_job_listings(listings)
        for job in filtered_listings:
            send_email(
                job["email"],
                "Your CV and Cover Letter",
                "Please find attached.",
                "cv_template.pdf",
                "cover_letter_template.pdf",
            )
        socketio.emit("job_search_result", filtered_listings)
