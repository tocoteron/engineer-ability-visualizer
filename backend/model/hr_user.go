package model

type HRUser struct {
	ID          uint64  `db:"id"`
	FirebaseUID string  `db:"firebase_uid"`
	Email       string  `db:"email"`
	FirstName   *string `db:"first_name"`
	LastName    *string `db:"last_name"`
	CompanyName *string `db:"company_name"`
}
