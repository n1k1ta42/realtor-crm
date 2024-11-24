package req

import (
	"encoding/json"
	"io"
)

func Decode[T interface{}](body io.Reader) (T, error) {
	var payload T
	err := json.NewDecoder(body).Decode(&payload)
	if err != nil {
		return payload, err
	}
	return payload, nil
}
