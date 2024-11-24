package user

type CreateUserRequest struct {
	Name    string `json:"name" validate:"required,min=2"`
	Surname string `json:"surname" validate:"required,min=2"`
	Email   string `json:"email" validate:"required,email"`
}

type UpdateUserRequest struct {
	Name    string `json:"name" validate:"min=2"`
	Surname string `json:"surname" validate:"min=2"`
	Email   string `json:"email" validate:"email"`
}

type ListUserResponse struct {
	Users []User `json:"users"`
	Count int64  `json:"count"`
}
