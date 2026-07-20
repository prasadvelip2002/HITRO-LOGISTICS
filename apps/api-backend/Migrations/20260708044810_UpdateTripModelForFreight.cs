using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api_backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTripModelForFreight : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "BalanceAmount",
                table: "Trips",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<string>(
                name: "BookingType",
                table: "Trips",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "FixedRate",
                table: "Trips",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "RatePerTon",
                table: "Trips",
                type: "numeric",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BalanceAmount",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "BookingType",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "FixedRate",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "RatePerTon",
                table: "Trips");
        }
    }
}
