package client

type CreateClientRequest struct {
	Name    string `json:"name" validate:"required,min=2"`
	Surname string `json:"surname" validate:"required,min=2"`
	Phone   string `json:"phone" validate:"required,min=2"`
	Email   string `json:"email" validate:"required,email"`
	Address string `json:"address"`
	Notes   string `json:"notes"`
}

type UpdateClientRequest struct {
	Name    string `json:"name"`
	Surname string `json:"surname"`
	Phone   string `json:"phone"`
	Email   string `json:"email" validate:"omitempty,email"`
	Address string `json:"address"`
	Notes   string `json:"notes"`
}

type ListClientResponse struct {
	Clients []Client `json:"clients"`
	Count   int64    `json:"count"`
}
