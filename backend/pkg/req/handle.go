package req

import (
	"net/http"
	"realtor-crm-backend/pkg/res"
)

func HandleBody[T interface{}](w *http.ResponseWriter, r *http.Request) (*T, error) {
	body, err := Decode[T](r.Body)
	if err != nil {
		res.Json(*w, http.StatusBadRequest, "bad request")
		return nil, err
	}
	err = IsValid(body)
	if err != nil {
		res.Json(*w, http.StatusBadRequest, err.Error())
		return nil, err
	}
	return &body, nil
}
