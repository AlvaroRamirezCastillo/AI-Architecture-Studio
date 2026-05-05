
## ENVIROMENT

src/features/architecture-generation/tools/env.ts

## MCP SERVER DE STRUCTURIZR

```code
git clone https://github.com/structurizr/structurizr.git
cd structurizr
```

```code
./mvnw -Dmaven.test.skip=true package -am -pl structurizr-mcp
```

```code
java -jar structurizr-mcp/target/structurizr-mcp-1.0.0.war -dsl -server-read -server-update
```

### descargar el server de structurizr

se debe poner en esta ruta

resources/structurizr/structurizr.war

el war lo descargas

```code
curl -O https://download.structurizr.com/structurizr.war
```
