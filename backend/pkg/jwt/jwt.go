package JWT

import (
	"github.com/golang-jwt/jwt/v5"
	"log"
	"math"
)

type JWT struct {
	Secret string
}

type DataJWT struct {
	Id uint
}

func NewJWT(secret string) *JWT {
	return &JWT{
		Secret: secret,
	}
}

func (j *JWT) CreateToken(data DataJWT) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id": data.Id,
	})
	s, err := token.SignedString([]byte(j.Secret))
	if err != nil {
		return "", err
	}
	return s, nil
}

func (j *JWT) VerifyToken(tokenString string) (bool, *DataJWT) {
	parse, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		return []byte(j.Secret), nil
	})
	if err != nil {
		return false, nil
	}
	id := parse.Claims.(jwt.MapClaims)["id"].(float64)
	if id < 0 || id > math.MaxUint {
		log.Println("float value out of uint range")
		return false, nil
	}
	uintId := uint(id)
	return parse.Valid, &DataJWT{Id: uintId}
}
