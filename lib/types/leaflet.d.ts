import "leaflet";

// Extend Leaflet types
declare module "leaflet" {
    // Allow _getIconUrl in Icon.Default
    namespace Icon {
        interface Default {
            _getIconUrl?: () => string;
        }
    }
}