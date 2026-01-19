namespace :nawat_branding do
  desc 'Setup Nawat branding configuration'
  task setup_branding: :environment do
    puts 'Setting up Nawat branding...'
    
    # Load configuration from YAML file
    ConfigLoader.new.process
    puts 'Loaded configuration from installation_config.yml'
    
    # Ensure INSTALLATION_NAME is set to 'Nawat branding'
    installation_config = InstallationConfig.find_or_create_by(name: 'INSTALLATION_NAME')
    installation_config.update(value: 'Nawat Support')
    puts "Set INSTALLATION_NAME to: #{installation_config.value}"
    
    # Verify other branding configs
    brand_name = InstallationConfig.find_by(name: 'BRAND_NAME')
    if brand_name&.value == 'Chatwoot'
      brand_name.update(value: 'Nawat Prime')
      puts "Updated BRAND_NAME from 'Chatwoot' to 'Nawat Prime'"
    end
    
    puts 'Nawat branding setup complete!'
  end
  
  desc 'Verify Nawat branding configuration'
  task verify_branding: :environment do
    puts 'Verifying Nawat branding configuration...'
    
    installation_name = GlobalConfig.get('INSTALLATION_NAME')
    brand_name = GlobalConfig.get('BRAND_NAME')
    
    puts "INSTALLATION_NAME: #{installation_name}"
    puts "BRAND_NAME: #{brand_name}"
    
    if installation_name['INSTALLATION_NAME'] == 'Nawat Support'
      puts '✅ INSTALLATION_NAME is correctly set to Nawat Support'
    else
      puts '❌ INSTALLATION_NAME is not set to Nawat Support'
    end
  end
end