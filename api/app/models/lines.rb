require 'accentless'
require_relative '../../lib/transport_modes'

class Line < Sequel::Model(:lines)
  plugin :timestamps, :update_on_create => true
  using Accentless

  include TransportModes
  include FeatureBackup

  many_to_one :city
  many_to_one :system

  def generate_url_name
    self.url_name = "#{self.id}-#{self.name.strip.accentless.gsub(/\s|\//,'-').downcase}"
  end

  def remove_from_feature(feature)
    klass = feature.is_a?(Section) ? SectionLine : StationLine
    attr = feature.is_a?(Section) ? :section_id : :station_id

    klass.where(attr => feature.id, :line_id => id).first.delete
  end

  def add_to_feature(feature)
    klass = feature.is_a?(Section) ? SectionLine : StationLine
    attr = feature.is_a?(Section) ? :section_id : :station_id

    klass.create(attr => feature.id, :line_id => id, city_id: city.id)
  end

  def transport_mode
    TRANSPORT_MODES[transport_mode_id || 0]
  end

  def width
    transport_mode[:width]
  end

  def min_width
    transport_mode[:min_width]
  end
end
