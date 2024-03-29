import { Injectable } from '@angular/core';

import { StorageService } from 'src/app/services/storage/storage.service';

@Injectable()
export class Global {

  map = {
    disableDefaultUI: true,
    gestureHandling: 'cooperative',
    styles: [
      {
        elementType: "geometry", 
        stylers: [{color: "#212121"}]
      },
      {
        elementType: "labels.icon",
        stylers: [{visibility: "off"}]
      },
      {
        elementType: "labels.text.fill",
        stylers: [{color: "#757575"}]
      },
      {
        elementType: "labels.text.stroke",
        stylers: [{color: "#212121"}]
      },
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [
          { color: "#757575" },
          { visibility: "off" }
        ]
      },
      {
        featureType: "administrative.country",
        elementType: "labels.text.fill",
        stylers: [{color: "#9e9e9e"}]
      },
      {
        featureType: "administrative.land_parcel",
        elementType: "labels",
        stylers: [{visibility: "off"}]
      },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{color: "#bdbdbd"}]
      },
      {
        featureType: "poi",
        stylers: [{visibility: "off"}]
      },
      {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{color: "#757575"}]
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{color: "#181818"}]
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{color: "#616161"}]
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.stroke",
        stylers: [{color: "#1b1b1b"}]
      },
      {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [{color: "#2c2c2c"}]
      },
      {
        featureType: "road",
        elementType: "labels.icon",
        stylers: [{visibility: "off"}]
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{color: "#8a8a8a"}]
      },
      {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [{color: "#373737"}]
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{color: "#3c3c3c"}]
      },
      {
        featureType: "road.highway.controlled_access",
        elementType: "geometry",
        stylers: [{color: "#4e4e4e"}]
      },
      {
        featureType: "road.local",
        elementType: "labels",
        stylers: [{visibility: "off"}]
      },
      {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [{color: "#616161"}]
      },
      {
        featureType: "transit",
        stylers: [{visibility: "off"}]
      },
      {
        featureType: "transit",
        elementType: "labels.text.fill",
        stylers: [{color: "#757575"}]
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{color: "#000000"}]
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{color: "#3d3d3d"}]
      }
    ]
  };

  constructor(
    private storage: StorageService,
  ) {}

  hasPermission(page: string, role: string): boolean {
    if (this.storage.getUser().superUser) return true;
    const permission = this.storage.getPermissions().find(permission => permission.page == page && permission.role == role);
    const permissionGroup = this.storage.getGroups().find(group => group._permissions.find(permission => permission.page == page && permission.role == role));
    return permission != undefined || permissionGroup != undefined;
  }
}