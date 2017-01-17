import mapboxgl from 'mapbox-gl/dist/mapbox-gl.js';

class MouseEvents {
  constructor(style, mappers) {
    this.style = style;
    this.mappers = mappers;
  }

  hover(features, callback) {
      const ids = {lines: {sections: [], stations: []}, plans: {sections: [], stations: []}};

      features.map((feature) => {
        const type = feature.layer.type == 'circle'? 'stations' : 'sections';
        const id = feature.properties.id;

        const mapperType = feature.properties.plan ? 'plans' : 'lines';

        ids[mapperType] = ids[mapperType] || {};
        ids[mapperType][type] = ids[type] || [];
        ids[mapperType][type].push(id);
      });

      Object.entries(this.mappers).map((entry) => {
        const mapperType = entry[0];
        const mapper = entry[1];
        if (typeof ids[mapperType] === 'undefined') return;
        Object.entries(ids[mapperType]).map((idEntry) => {
          const type = idEntry[0];
          const idsMapperType = idEntry[1];
          mapper.setHoverIds(type, idsMapperType);
          if (typeof callback === 'function') callback();
        });
      });
  }

  layerNames() {
    const layers = [];
    Object.values(this.mappers).map((mapper) => {
      Object.values(mapper.layers).map((type) => {
        Object.values(type).map((layer) => {
          if (layer.indexOf('hover') === -1 && layer.indexOf('inner') === -1) {
            layers.push(layer);
          }
        });
      });
    });
    return layers;
  }

}

export default MouseEvents
