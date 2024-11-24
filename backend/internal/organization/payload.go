package organization

type CreateOrganizationRequest struct {
	Name    string `json:"name" validate:"required,min=2"`
	Address string `json:"address" validate:"required,min=2"`
	Phone   string `json:"phone" validate:"required,min=2"`
	Email   string `json:"email" validate:"required,email"`
}

type UpdateOrganizationRequest struct {
	Name    string `json:"name"`
	Address string `json:"address"`
	Phone   string `json:"phone"`
	Email   string `json:"email" validate:"email"`
}

type ListOrganizationResponse struct {
	Organizations []Organization `json:"organizations"`
	Count         int64          `json:"count"`
}
