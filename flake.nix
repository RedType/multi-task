{
  description = "A simple todo list tool";

  inputs.nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  inputs.utils.url = "github:numtide/flake-utils";

  outputs = { nixpkgs, utils, ... }:
    utils.lib.eachDefaultSystem (system:
    let
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShell = pkgs.mkShell {
        # build dependencies
        nativeBuildInputs = with pkgs;
          [ nodePackages.ionic
          ];
        # runtime dependencies
        buildInputs = with pkgs;
          [ nodejs
          ];
      };
    });
}
