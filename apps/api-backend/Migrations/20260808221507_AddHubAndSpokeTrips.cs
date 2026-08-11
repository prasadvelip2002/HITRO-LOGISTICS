using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddHubAndSpokeTrips : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "LegType",
                table: "Trips",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "ParentTripId",
                table: "Trips",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Trips_ParentTripId",
                table: "Trips",
                column: "ParentTripId");

            migrationBuilder.AddForeignKey(
                name: "FK_Trips_Trips_ParentTripId",
                table: "Trips",
                column: "ParentTripId",
                principalTable: "Trips",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Trips_Trips_ParentTripId",
                table: "Trips");

            migrationBuilder.DropIndex(
                name: "IX_Trips_ParentTripId",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "LegType",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "ParentTripId",
                table: "Trips");
        }
    }
}
