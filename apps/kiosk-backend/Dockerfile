FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copier uniquement les fichiers de projet pour optimiser le cache Docker
COPY *.csproj ./
RUN dotnet restore

# Copier le reste des fichiers et compiler
COPY . ./
RUN dotnet publish -c Release -o /app/publish --no-restore

# Image finale
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Créer un utilisateur non-root pour la sécurité
RUN adduser --disabled-password --gecos '' --uid 1000 appuser && chown -R appuser /app
USER appuser

COPY --from=build --chown=appuser:appuser /app/publish .

EXPOSE 5000
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

ENTRYPOINT ["dotnet", "kiosk-backend.dll"]
