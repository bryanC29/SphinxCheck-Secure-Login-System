from flask import Flask, request, jsonify
from collections import defaultdict
from typing import Dict, Set

app = Flask(__name__)

# In-memory tracking data structures
class RequestTracker:
    def __init__(self):
        # Track IPs used by each user
        self.user_ips: Dict[str, Set[str]] = defaultdict(set)
        
        # Track users from each IP
        self.ip_users: Dict[str, Set[str]] = defaultdict(set)
        
        # Track suspension and blocking status
        self.suspended_users: Set[str] = set()
        self.blocked_ips: Set[str] = set()

    def track_request(self, user_id: str, ip_address: str):
        # Check if IP is already blocked
        if ip_address in self.blocked_ips:
            return False, "IP is blocked"
        
        # Check if user is suspended
        if user_id in self.suspended_users:
            return False, "User is suspended"
        
        # Track IP for this user
        self.user_ips[user_id].add(ip_address)
        
        # Track users for this IP
        self.ip_users[ip_address].add(user_id)
        
        # Check conditions for blocking/suspension
        self._check_blocking_conditions(user_id, ip_address)
        
        return True, "Request processed"

    def _check_blocking_conditions(self, user_id: str, ip_address: str):
        # Block IP if used by multiple unique users
        if len(self.ip_users[ip_address]) > 1:
            self.blocked_ips.add(ip_address)
        
        # Suspend user if they've used multiple unique IPs
        if len(self.user_ips[user_id]) > 1:
            self.suspended_users.add(user_id)

# Global request tracker
request_tracker = RequestTracker()

@app.route('/process_request', methods=['POST'])
def process_request():
    data = request.json
    
    # Validate input
    if not data or 'userId' not in data or 'ipAddress' not in data:
        return jsonify({
            "status": "error",
            "message": "Missing userId or ipAddress"
        }), 400
    
    user_id = data['userId']
    ip_address = data['ipAddress']
    
    # Process the request
    success, message = request_tracker.track_request(user_id, ip_address)
    
    if not success:
        return jsonify({
            "status": "error",
            "message": message
        }), 403
    
    return jsonify({
        "status": "success",
        "message": "Request processed successfully"
    })

@app.route('/get_status', methods=['GET'])
def get_status():
    user_id = request.args.get('userId')
    ip_address = request.args.get('ipAddress')
    
    if not user_id and not ip_address:
        return jsonify({
            "status": "error",
            "message": "Provide either userId or ipAddress"
        }), 400
    
    status = {
        "suspended_users": list(request_tracker.suspended_users),
        "blocked_ips": list(request_tracker.blocked_ips)
    }
    
    return jsonify(status)

if __name__ == '__main__':
    app.run(debug=True)