up:
	docker-compose up

down:
	docker-compose down

DB_SERVICE:=db
DB_NAME:=engineer-ability-visualizer
db/client:
	docker-compose exec $(DB_SERVICE) mysql -uroot -hlocalhost -ppassword $(DB_NAME)

db/init:
	docker-compose exec $(DB_SERVICE) \
		mysql -u root -h localhost -ppassword \
		-e "CREATE DATABASE \`$(DB_NAME)\`"

db/drop:
	docker-compose exec $(DB_SERVICE) \
		mysql -u root -h localhost -ppassword \
		-e "drop database \`$(DB_NAME)\`"