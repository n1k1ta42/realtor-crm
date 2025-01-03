package user

type CreateUserRequest struct {
	Name           string `json:"name" validate:"required,min=2"`
	Surname        string `json:"surname" validate:"required,min=2"`
	Email          string `json:"email" validate:"required,email"`
	Role           string `json:"role" validate:"required,eq=worker|eq=admin|eq=director"`
	OrganizationId uint   `json:"organizationId" validate:"required"`
}

type UpdateUserRequest struct {
	Name    string `json:"name"`
	Surname string `json:"surname"`
	Email   string `json:"email" validate:"omitempty,email"`
	Avatar  string `json:"avatar"`
}

type ListUserResponse struct {
	Users []User `json:"users"`
	Count int64  `json:"count"`
}
