import sys
import pandas as pd
from joblib import load

try:
    if len(sys.argv) < 2:
        raise ValueError("CSV file path not provided. Usage: python predict.py <csv_file_path>")
    
    # Load the trained model
    model_filename = 'F:/sulaim project/enhancewebsite/sulaims/server/adaboost_model.joblib'
    loaded_model = load(model_filename)

    # Read the CSV file path from command line arguments
    csv_file_path = sys.argv[1]
    new_data = pd.read_csv(csv_file_path)

    print(f"CSV file loaded from: {csv_file_path}")

    # Ensure that the new data contains the same features as the training data
    predictor_names = [
        'flow_duration', 'Header_Length', 'Duration', 'Rate', 'Srate', 'Drate',
        'fin_flag_number', 'syn_flag_number', 'rst_flag_number', 'psh_flag_number',
        'ack_flag_number', 'ece_flag_number', 'cwr_flag_number', 'ack_count',
        'syn_count', 'fin_count', 'urg_count', 'rst_count', 'HTTP', 'HTTPS', 'DNS',
        'Telnet', 'SMTP', 'SSH', 'IRC', 'TCP', 'UDP', 'DHCP', 'ARP', 'ICMP', 'IPv',
        'LLC', 'Tot sum', 'Min', 'Max', 'AVG', 'Std', 'Tot size', 'IAT', 'Number',
        'Magnitue', 'Radius', 'Covariance', 'Variance', 'Weight'
    ]

    predictors = new_data[predictor_names]

    # Make predictions using the loaded model
    new_predictions = loaded_model.predict(predictors)

    print(f"Predictions: {new_predictions}")

    # Add the predicted labels to the new_data DataFrame
    new_data['Predicted_Labels'] = new_predictions

    # Save the predictions to a new CSV file
    predictions_filename = 'predictions_check.csv'
    new_data.to_csv(predictions_filename, index=False)

    print(f"Predictions saved to: {predictions_filename}")

    # Print the predictions (will be captured by Node.js)
    print(new_predictions)

except Exception as e:
    print(f"Error: {e}")
    raise
