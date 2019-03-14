from flask import Flask
from flask_restful import Resource, Api
from flask_cors import CORS
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import roc_curve
from sklearn.preprocessing import MinMaxScaler, StandardScaler
import pandas as pd
import numpy as np

app = Flask(__name__)
api = Api(app)
CORS(app)

class ROC(Resource):
    
    def get(self, preprocessing, c):
        # you need to preprocess the data according to user preferences (only fit preprocessing on train data)
        # fit the model on the training set
        # predict probabilities on test set
        if preprocessing=='min-max':
            scaler = MinMaxScaler()
        elif preprocessing=='standardization':
            scaler = StandardScaler()
        else:
            return {'error':'choose min-max or standardization for processing'}
        scaler.fit(X_train)
        X_trainScaled = scaler.transform(X_train)
        X_testScaled = scaler.transform(X_test)
        clf = LogisticRegression(C=c)
        clf.fit(X_trainScaled,y_train)
        y_proba = clf.predict_proba(X_testScaled)

        fpr, tpr, thres = roc_curve(y_true=y_test,y_score=y_proba[:,1])
        
        res = [{'fpr':fpr[i].item(),'tpr':tpr[i].item(),'threshold':thres[i].item()} for i in range(len(thres))]
        return res

api.add_resource(ROC,'/<string:preprocessing>&<float:c>')
# Here you need to add the ROC resource, ex: api.add_resource(HelloWorld, '/')
# for examples see 
# https://flask-restful.readthedocs.io/en/latest/quickstart.html#a-minimal-api

if __name__ == '__main__':
    # load data
    df = pd.read_csv('data/transfusion.data')
    df = df.rename(columns={'whether he/she donated blood in March 2007':'Donated'})

    xDf = df.loc[:, df.columns != 'Donated']
    y = df['Donated']
    # get random numbers to split into train and test
    np.random.seed(1)
    r = np.random.rand(len(df))
    # split into train test
    X_train = xDf[r < 0.8]
    X_test = xDf[r >= 0.8]
    y_train = y[r < 0.8]
    y_test = y[r >= 0.8]
    app.run(debug=True)