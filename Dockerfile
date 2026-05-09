FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 8080
ENV ASPNETCORE_URLS=http://+:8080

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore "CasLibraryNowAPI/CasLibraryNowAPI.csproj"
RUN dotnet publish "CasLibraryNowAPI/CasLibraryNowAPI.csproj" -c Release -o /app

FROM base AS final
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "CasLibraryNowAPI.dll"]
