FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copiar el JAR construido
COPY target/*.jar app.jar

# Puerto que expone Spring Boot
EXPOSE 8080

# Comando para ejecutar la app
ENTRYPOINT ["java", "-jar", "app.jar"]