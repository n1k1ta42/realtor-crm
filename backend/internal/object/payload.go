package object

type CreateObjectRequest struct {
	Title       string  `json:"title" validate:"required,min=2"`
	Description string  `json:"description" validate:"required,min=2"`
	Address     string  `json:"address" validate:"required,min=2"`
	Price       float64 `json:"price" validate:"required"`
	ObjectType  string  `json:"objectType" validate:"required,min=2"`
	Status      string  `json:"status"`
}

type UpdateObjectRequest struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	Address     string  `json:"address"`
	Price       float64 `json:"price"`
	ObjectType  string  `json:"objectType"`
	Status      string  `json:"status"`
}

type ListObjectResponse struct {
	Objects []Object `json:"objects"`
	Count   int64    `json:"count"`
}
