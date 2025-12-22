class UserModel {
  final String id;
  final String email;
  final DateTime? createdAt;
  final DateTime? lastSignInAt;

  UserModel({
    required this.id,
    required this.email,
    this.createdAt,
    this.lastSignInAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String,
      email: json['email'] as String,
      createdAt: json['created_at'] != null
          ? DateTime.parse(json['created_at'] as String)
          : null,
      lastSignInAt: json['last_sign_in_at'] != null
          ? DateTime.parse(json['last_sign_in_at'] as String)
          : null,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'created_at': createdAt?.toIso8601String(),
      'last_sign_in_at': lastSignInAt?.toIso8601String(),
    };
  }

  @override
  String toString() {
    return 'UserModel(id: $id, email: $email, createdAt: $createdAt, lastSignInAt: $lastSignInAt)';
  }
}
