package deal

type CreateDealRequest struct {
	UserId   uint `json:"userId"`
	ClientId uint `json:"clientId"`
	ObjectId uint `json:"objectId"`
}

type UpdateDealRequest struct {
	UserId   uint `json:"userId"`
	ClientId uint `json:"clientId"`
	ObjectId uint `json:"objectId"`
}

type ListDealResponse struct {
	Deals []Deal `json:"deals"`
	Count int64  `json:"count"`
}
