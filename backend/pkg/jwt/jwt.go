package JWT

import "github.com/golang-jwt/jwt/v5"

type JWT struct {
	Secret string
}

type DataJWT struct {
	Email string
}

func NewJWT(secret string) *JWT {
	return &JWT{
		Secret: secret,
	}
}

func (j *JWT) CreateToken(data DataJWT) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": data.Email,
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
	email := parse.Claims.(jwt.MapClaims)["email"].(string)
	return parse.Valid, &DataJWT{Email: email}
}
