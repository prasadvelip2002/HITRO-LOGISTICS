using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace api_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAdvancedTMSModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "CustomerRate",
                table: "Trips",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SupervisorContact",
                table: "Trips",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SupervisorName",
                table: "Trips",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SupplierPaymentTo",
                table: "Trips",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SupplierRate",
                table: "Trips",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BankProofUrl",
                table: "Payments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BeneficiaryType",
                table: "Payments",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DriverId",
                table: "Payments",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CustomerRate",
                table: "Indents",
                type: "numeric",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PricingModel",
                table: "Indents",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RFQStatus",
                table: "Indents",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "CustomerRateContracts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CustomerId = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: false),
                    Destination = table.Column<string>(type: "text", nullable: false),
                    VehicleType = table.Column<string>(type: "text", nullable: true),
                    Rate = table.Column<decimal>(type: "numeric", nullable: false),
                    EffectiveFrom = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    EffectiveTo = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerRateContracts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerRateContracts_Customers_CustomerId",
                        column: x => x.CustomerId,
                        principalTable: "Customers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CustomerRateContracts_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SupplierQuotations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    IndentId = table.Column<int>(type: "integer", nullable: false),
                    VendorId = table.Column<int>(type: "integer", nullable: false),
                    QuotedRate = table.Column<decimal>(type: "numeric", nullable: false),
                    VehicleNumber = table.Column<string>(type: "text", nullable: true),
                    DriverName = table.Column<string>(type: "text", nullable: true),
                    Status = table.Column<string>(type: "text", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupplierQuotations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SupplierQuotations_Indents_IndentId",
                        column: x => x.IndentId,
                        principalTable: "Indents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SupplierQuotations_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SupplierQuotations_Vendors_VendorId",
                        column: x => x.VendorId,
                        principalTable: "Vendors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TripEvents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TripId = table.Column<int>(type: "integer", nullable: false),
                    EventType = table.Column<string>(type: "text", nullable: false),
                    Latitude = table.Column<decimal>(type: "numeric", nullable: false),
                    Longitude = table.Column<decimal>(type: "numeric", nullable: false),
                    LocationAddress = table.Column<string>(type: "text", nullable: true),
                    EventTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripEvents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TripEvents_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TripEvents_Trips_TripId",
                        column: x => x.TripId,
                        principalTable: "Trips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Payments_DriverId",
                table: "Payments",
                column: "DriverId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerRateContracts_CustomerId",
                table: "CustomerRateContracts",
                column: "CustomerId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerRateContracts_TenantId",
                table: "CustomerRateContracts",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_SupplierQuotations_IndentId",
                table: "SupplierQuotations",
                column: "IndentId");

            migrationBuilder.CreateIndex(
                name: "IX_SupplierQuotations_TenantId",
                table: "SupplierQuotations",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_SupplierQuotations_VendorId",
                table: "SupplierQuotations",
                column: "VendorId");

            migrationBuilder.CreateIndex(
                name: "IX_TripEvents_TenantId",
                table: "TripEvents",
                column: "TenantId");

            migrationBuilder.CreateIndex(
                name: "IX_TripEvents_TripId",
                table: "TripEvents",
                column: "TripId");

            migrationBuilder.AddForeignKey(
                name: "FK_Payments_Drivers_DriverId",
                table: "Payments",
                column: "DriverId",
                principalTable: "Drivers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Payments_Drivers_DriverId",
                table: "Payments");

            migrationBuilder.DropTable(
                name: "CustomerRateContracts");

            migrationBuilder.DropTable(
                name: "SupplierQuotations");

            migrationBuilder.DropTable(
                name: "TripEvents");

            migrationBuilder.DropIndex(
                name: "IX_Payments_DriverId",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "CustomerRate",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "SupervisorContact",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "SupervisorName",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "SupplierPaymentTo",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "SupplierRate",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "BankProofUrl",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "BeneficiaryType",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "DriverId",
                table: "Payments");

            migrationBuilder.DropColumn(
                name: "CustomerRate",
                table: "Indents");

            migrationBuilder.DropColumn(
                name: "PricingModel",
                table: "Indents");

            migrationBuilder.DropColumn(
                name: "RFQStatus",
                table: "Indents");
        }
    }
}
