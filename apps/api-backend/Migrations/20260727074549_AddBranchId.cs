using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace api_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddBranchId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BranchId",
                table: "Users",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BranchId",
                table: "Trips",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LRGenerationType",
                table: "Trips",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ManualLRNumber",
                table: "Trips",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PODReceivedDate",
                table: "Trips",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PODUploadedDate",
                table: "Trips",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsPreferred",
                table: "SupplierQuotations",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "BranchId",
                table: "Indents",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Branches",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: true),
                    TenantId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Branches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Branches_Tenants_TenantId",
                        column: x => x.TenantId,
                        principalTable: "Tenants",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_BranchId",
                table: "Users",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Trips_BranchId",
                table: "Trips",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Indents_BranchId",
                table: "Indents",
                column: "BranchId");

            migrationBuilder.CreateIndex(
                name: "IX_Branches_TenantId",
                table: "Branches",
                column: "TenantId");

            migrationBuilder.AddForeignKey(
                name: "FK_Indents_Branches_BranchId",
                table: "Indents",
                column: "BranchId",
                principalTable: "Branches",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Trips_Branches_BranchId",
                table: "Trips",
                column: "BranchId",
                principalTable: "Branches",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Branches_BranchId",
                table: "Users",
                column: "BranchId",
                principalTable: "Branches",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Indents_Branches_BranchId",
                table: "Indents");

            migrationBuilder.DropForeignKey(
                name: "FK_Trips_Branches_BranchId",
                table: "Trips");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_Branches_BranchId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "Branches");

            migrationBuilder.DropIndex(
                name: "IX_Users_BranchId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Trips_BranchId",
                table: "Trips");

            migrationBuilder.DropIndex(
                name: "IX_Indents_BranchId",
                table: "Indents");

            migrationBuilder.DropColumn(
                name: "BranchId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "BranchId",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "LRGenerationType",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "ManualLRNumber",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "PODReceivedDate",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "PODUploadedDate",
                table: "Trips");

            migrationBuilder.DropColumn(
                name: "IsPreferred",
                table: "SupplierQuotations");

            migrationBuilder.DropColumn(
                name: "BranchId",
                table: "Indents");
        }
    }
}
