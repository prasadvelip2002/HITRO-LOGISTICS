using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace api_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddMultiTenancyAndNewFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "WhatsAppLogs",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "RouteRemarks",
                table: "Vendors",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "Vendors",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "Vehicles",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "EndingKM",
                table: "Trips",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EwayBillNumber",
                table: "Trips",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "FuelAdvance",
                table: "Trips",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "StartingKM",
                table: "Trips",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "Trips",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "TollCharges",
                table: "Trips",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TripEndDate",
                table: "Trips",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "TripStartDate",
                table: "Trips",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "Payments",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "Notifications",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "DestinationsJson",
                table: "Indents",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "RequiresWhatsAppShare",
                table: "Indents",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "Indents",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "Drivers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiryDate",
                table: "Documents",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "Documents",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "Customers",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TenantId",
                table: "AdditionalCharges",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Tenants",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tenants", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Users_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WhatsAppLogs_TenantId",
                table: "WhatsAppLogs",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Vendors_TenantId",
                table: "Vendors",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Vehicles_TenantId",
                table: "Vehicles",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Trips_TenantId",
                table: "Trips",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Payments_TenantId",
                table: "Payments",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_TenantId",
                table: "Notifications",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Indents_TenantId",
                table: "Indents",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Drivers_TenantId",
                table: "Drivers",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Documents_TenantId",
                table: "Documents",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Customers_TenantId",
                table: "Customers",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_AdditionalCharges_TenantId",
                table: "AdditionalCharges",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_TenantId",
                table: "Users",
                column: "TenantId");

            migrationBuilder.AddForeignKey(
                name: "FK_AdditionalCharges_Tenants_TenantId",
                table: "AdditionalCharges",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Customers_Tenants_TenantId",
                table: "Customers",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Documents_Tenants_TenantId",
                table: "Documents",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Drivers_Tenants_TenantId",
                table: "Drivers",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Indents_Tenants_TenantId",
                table: "Indents",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Tenants_TenantId",
                table: "Notifications",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Tenants_TenantId",
                table: "Payments",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Trips_Tenants_TenantId",
                table: "Trips",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Vehicles_Tenants_TenantId",
                table: "Vehicles",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Vendors_Tenants_TenantId",
                table: "Vendors",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_WhatsAppLogs_Tenants_TenantId",
                table: "WhatsAppLogs",
                column: "TenantId",
                principalTable: "Tenants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AdditionalCharges_Tenants_TenantId",
                table: "AdditionalCharges");

            migrationBuilder.DropForeignKey(
                name: "FK_Customers_Tenants_TenantId",
                table: "Customers");

            migrationBuilder.DropForeignKey(
                name: "FK_Documents_Tenants_TenantId",
                table: "Documents");

            migrationBuilder.DropForeignKey(
                name: "FK_Drivers_Tenants_TenantId",
                table: "Drivers");

            migrationBuilder.DropForeignKey(
                name: "FK_Indents_Tenants_TenantId",
                table: "Indents");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Tenants_TenantId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Tenants_TenantId",
                table: "Payments");

            migrationBuilder.DropForeignKey(
                name: "FK_Trips_Tenants_TenantId",
                table: "Trips");

            migrationBuilder.DropForeignKey(
                name: "FK_Vehicles_Tenants_TenantId",
                table: "Vehicles");

            migrationBuilder.DropForeignKey(
                name: "FK_Vendors_Tenants_TenantId",
                table: "Vendors");

            migrationBuilder.DropForeignKey(
                name: "FK_WhatsAppLogs_Tenants_TenantId",
                table: "WhatsAppLogs");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Tenants");

            migrationBuilder.DropIndex(
                name: "IX_WhatsAppLogs_TenantId",
                table: "WhatsAppLogs");

            migrationBuilder.DropIndex(
                name: "IX_Vendors_TenantId",
                table: "Vendors");

            migrationBuilder.DropIndex(
                name: "IX_Vehicles_TenantId",
                table: "Vehicles");

            migrationBuilder.DropIndex(
                name: "IX_Trips_TenantId",
                table: "Trips");

            migrationBuilder.DropIndex(
                name: "IX_Payments_TenantId",
                table: "Payments");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_TenantId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Indents_TenantId",
                table: "Indents");

            migrationBuilder.DropIndex(
                name: "IX_Drivers_TenantId",
                table: "Drivers");

            migrationBuilder.DropIndex(
                name: "IX_Documents_TenantId",
                table: "Documents");

            migrationBuilder.DropIndex(
                name: "IX_Customers_TenantId",
                table: "Customers");

            migrationBuilder.DropIndex(
                name: "IX_AdditionalCharges_TenantId",
                table: "AdditionalCharges");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "WhatsAppLogs");

            migrationBuilder.DropColumn(
                name: "RouteRemarks",
                table: "Vendors");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "Vendors");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "Vehicles");

            migrationBuilder.DropColumn(
                name: "EndingKM",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "EwayBillNumber",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "FuelAdvance",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "StartingKM",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "TollCharges",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "TripEndDate",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "TripStartDate",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "DestinationsJson",
                table: "Indents");

            migrationBuilder.DropColumn(
                name: "RequiresWhatsAppShare",
                table: "Indents");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "Indents");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "Drivers");

            migrationBuilder.DropColumn(
                name: "ExpiryDate",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "Documents");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "Customers");

            migrationBuilder.DropColumn(
                name: "TenantId",
                table: "AdditionalCharges");
        }
    }
}
