up:
	docker-compose up $(container)

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

MIGRATION_SERVICE:=migration
FLYWAY_CONF?=-url=jdbc:mysql://$(DB_SERVICE):3306/$(DB_NAME) -user=root -password=password
flyway/info:
	docker-compose run --rm $(MIGRATION_SERVICE) $(FLYWAY_CONF) info

flyway/validate:
	docker-compose run --rm $(MIGRATION_SERVICE) $(FLYWAY_CONF) validate

flyway/migrate:
	docker-compose run --rm $(MIGRATION_SERVICE) $(FLYWAY_CONF) migrate

flyway/repair:
	docker-compose run --rm $(MIGRATION_SERVICE) $(FLYWAY_CONF) repair

flyway/baseline:
	docker-compose run --rm $(MIGRATION_SERVICE) $(FLYWAY_CONF) baseline