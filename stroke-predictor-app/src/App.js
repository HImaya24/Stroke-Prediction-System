import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    age: 50,
    gender: 'Male',
    hypertension: 0,
    heart_disease: 0,
    ever_married: 'Yes',
    work_type: 'Private',
    Residence_type: 'Urban',
    avg_glucose_level: 100,
    bmi: 25,
    smoking_status: 'never smoked'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);
    
    try {
      const response = await axios.post('http://localhost:5000/predict', formData);
      
      if (response.data.success) {
        setPrediction(response.data);
      } else {
        setError('Prediction failed: ' + response.data.error);
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the Python API is running on port 5000.');
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const RiskIndicator = ({ level, color }) => (
    <div className="risk-indicator" style={{ borderColor: color }}>
      <div className="risk-level" style={{ color: color }}>
        {level === 'HIGH' ? '🚨 ' : level === 'MEDIUM' ? '⚠️ ' : '✅ '}
        {level} RISK
      </div>
    </div>
  );

  const getRiskFactors = () => {
    const factors = [];
    
    if (formData.age >= 65) factors.push('Age (65+)');
    if (formData.hypertension === 1) factors.push('Hypertension');
    if (formData.heart_disease === 1) factors.push('Heart Disease');
    if (formData.avg_glucose_level >= 200) factors.push('High Glucose');
    if (formData.bmi >= 30) factors.push('High BMI');
    if (formData.smoking_status === 'smokes') factors.push('Smoking');
    
    return factors;
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1> Stroke Risk Prediction</h1>
          <p>Assess your stroke risk using advanced machine learning</p>
        </header>

        <div className="content">
          <form onSubmit={handleSubmit} className="form">
            <div className="form-sections">
              {/* Personal Information */}
              <div className="form-section">
                <h3>👤 Personal Information</h3>
                
                <div className="input-group">
                  <label>Age <span className="required">*</span></label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    min="0"
                    max="120"
                    required
                  />
                  <small>Years</small>
                </div>

                <div className="input-group">
                  <label>Gender <span className="required">*</span></label>
                  <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Ever Married <span className="required">*</span></label>
                  <select name="ever_married" value={formData.ever_married} onChange={handleChange} required>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              {/* Health Conditions */}
              <div className="form-section">
                <h3>❤️ Health Conditions</h3>
                
                <div className="input-group">
                  <label>Hypertension <span className="required">*</span></label>
                  <select name="hypertension" value={formData.hypertension} onChange={handleChange} required>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                  <small>High blood pressure</small>
                </div>

                <div className="input-group">
                  <label>Heart Disease <span className="required">*</span></label>
                  <select name="heart_disease" value={formData.heart_disease} onChange={handleChange} required>
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                  </select>
                  <small>History of heart conditions</small>
                </div>

                <div className="input-group">
                  <label>Average Glucose Level <span className="required">*</span></label>
                  <input
                    type="number"
                    name="avg_glucose_level"
                    value={formData.avg_glucose_level}
                    onChange={handleChange}
                    step="0.1"
                    min="50"
                    max="300"
                    required
                  />
                  <small>mg/dL (Normal: &lt;140 mg/dL)</small>
                </div>

                <div className="input-group">
                  <label>BMI <span className="required">*</span></label>
                  <input
                    type="number"
                    name="bmi"
                    value={formData.bmi}
                    onChange={handleChange}
                    step="0.1"
                    min="10"
                    max="70"
                    required
                  />
                  <small>Body Mass Index (Normal: 18.5-24.9)</small>
                </div>
              </div>

              {/* Lifestyle */}
              <div className="form-section">
                <h3>🚬 Lifestyle</h3>
                
                <div className="input-group">
                  <label>Smoking Status <span className="required">*</span></label>
                  <select name="smoking_status" value={formData.smoking_status} onChange={handleChange} required>
                    <option value="never smoked">Never Smoked</option>
                    <option value="formerly smoked">Formerly Smoked</option>
                    <option value="smokes">Currently Smokes</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Work Type <span className="required">*</span></label>
                  <select name="work_type" value={formData.work_type} onChange={handleChange} required>
                    <option value="Private">Private Sector</option>
                    <option value="Self-employed">Self Employed</option>
                    <option value="Govt_job">Government Job</option>
                    <option value="children">Student/Child</option>
                    <option value="Never_worked">Never Worked</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Residence Type <span className="required">*</span></label>
                  <select name="Residence_type" value={formData.Residence_type} onChange={handleChange} required>
                    <option value="Urban">Urban</option>
                    <option value="Rural">Rural</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={`predict-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                '🔍 Predict Stroke Risk'
              )}
            </button>
          </form>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          {prediction && (
            <div className="results">
              <h2>📊 Prediction Results</h2>
              
              <RiskIndicator level={prediction.risk_level} color={prediction.risk_color} />
              
              <div className="results-grid">
                <div className="result-card">
                  <h3>Stroke Probability</h3>
                  <div className="probability">
                    {(prediction.probability * 100).toFixed(1)}%
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${prediction.probability * 100}%`,
                        backgroundColor: prediction.risk_color
                      }}
                    ></div>
                  </div>
                  <small>Model confidence</small>
                </div>

                <div className="result-card">
                  <h3>Risk Assessment</h3>
                  <div className="assessment">
                    {prediction.prediction === 1 ? (
                      <div className="high-risk">
                        <div className="icon">🚨</div>
                        <div>At Risk</div>
                      </div>
                    ) : (
                      <div className="low-risk">
                        <div className="icon">✅</div>
                        <div>Low Risk</div>
                      </div>
                    )}
                  </div>
                  <small>Based on optimal threshold</small>
                </div>

                <div className="result-card">
                  <h3>Risk Factors</h3>
                  <div className="risk-factors-count">
                    {getRiskFactors().length}
                  </div>
                  <small>Key risk factors detected</small>
                </div>
              </div>

              <div className="recommendations">
                <h3>💡 Recommendations</h3>
                {prediction.risk_level === 'HIGH' ? (
                  <div className="high-risk-rec">
                    <p><strong>🚨 Immediate Attention Recommended</strong></p>
                    <ul>
                      <li>Schedule appointment with healthcare provider</li>
                      <li>Monitor blood pressure daily</li>
                      <li>Consider lifestyle modifications</li>
                      <li>Regular cardiovascular checkups</li>
                      <li>Discuss preventive medications with doctor</li>
                    </ul>
                  </div>
                ) : prediction.risk_level === 'MEDIUM' ? (
                  <div className="medium-risk-rec">
                    <p><strong>⚠️ Preventive Measures Recommended</strong></p>
                    <ul>
                      <li>Regular health screenings every 6 months</li>
                      <li>Maintain healthy diet and exercise routine</li>
                      <li>Monitor blood pressure and glucose levels</li>
                      <li>Annual comprehensive checkups</li>
                      <li>Consider reducing risk factors</li>
                    </ul>
                  </div>
                ) : (
                  <div className="low-risk-rec">
                    <p><strong>✅ Continue Healthy Habits</strong></p>
                    <ul>
                      <li>Maintain current lifestyle</li>
                      <li>Regular preventive checkups annually</li>
                      <li>Stay active and eat balanced diet</li>
                      <li>Monitor any changes in health</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="risk-factors-detail">
                <h3>📈 Your Identified Risk Factors</h3>
                <div className="factors-grid">
                  {getRiskFactors().length > 0 ? (
                    getRiskFactors().map((factor, index) => (
                      <div key={index} className="factor high">
                        ⚠️ {factor}
                      </div>
                    ))
                  ) : (
                    <div className="factor normal">
                      ✅ No major risk factors identified
                    </div>
                  )}
                </div>
              </div>

              <div className="disclaimer">
                <p>
                  <strong>Disclaimer:</strong> This prediction is based on machine learning analysis and should not replace professional medical advice. 
                  Always consult with healthcare providers for medical decisions.
                </p>
              </div>
            </div>
          )}

          {!prediction && !loading && (
            <div className="sample-cases">
              <h3>💡 Try Sample Cases</h3>
              <div className="sample-buttons">
                <button 
                  className="sample-btn high-risk"
                  onClick={() => setFormData({
                    age: 80,
                    gender: 'Male',
                    hypertension: 1,
                    heart_disease: 1,
                    ever_married: 'Yes',
                    work_type: 'Self-employed',
                    Residence_type: 'Urban',
                    avg_glucose_level: 280,
                    bmi: 45,
                    smoking_status: 'smokes'
                  })}
                >
                  High Risk Case
                </button>
                <button 
                  className="sample-btn medium-risk"
                  onClick={() => setFormData({
                    age: 65,
                    gender: 'Female',
                    hypertension: 1,
                    heart_disease: 0,
                    ever_married: 'Yes',
                    work_type: 'Private',
                    Residence_type: 'Urban',
                    avg_glucose_level: 180,
                    bmi: 32,
                    smoking_status: 'formerly smoked'
                  })}
                >
                  Medium Risk Case
                </button>
                <button 
                  className="sample-btn low-risk"
                  onClick={() => setFormData({
                    age: 35,
                    gender: 'Female',
                    hypertension: 0,
                    heart_disease: 0,
                    ever_married: 'Yes',
                    work_type: 'Private',
                    Residence_type: 'Urban',
                    avg_glucose_level: 95,
                    bmi: 24,
                    smoking_status: 'never smoked'
                  })}
                >
                  Low Risk Case
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;