import React, { useContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import { FhirClientContext } from '../utils/FhirClientContext';
import { LoadingSpinner } from '../components/LoadingSpinner';

import doctorImg from '../images/doctorX.png';
import { Nav } from 'react-bootstrap';
import Questionnaire from './Questionnaire';

export default function DashBoard() {
  const history = useHistory();
  const { client }: any = useContext(FhirClientContext);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [practitioner, setPractitioner]: [any, any] = useState(null);

  const [selectTab, setSelectTab]: [string, any] = useState('questionnaires');
  const [selectItem, setSelectItem]: [any | null, any] = useState(null);

  useEffect(() => {
    if (client.state.tokenResponse.access_token) {
      setIsLoading(true);
      Promise.all([
        client.user.read(),
        client.request(
          selectTab === 'history' && practitioner
            ? `/QuestionnaireResponse?author=Practitioner/${practitioner.id}`
            : `/QuestionnaireResponse`,
          {
            pageLimit: 1,
            flat: true,
          }
        ),
      ]).then(
        ([user, questionnaires]) => {
          setPractitioner(user);
          setQuestionnaires(questionnaires);
          setIsLoading(false);
        },
        (error) => {
          setError(error);
          setIsLoading(false);
        }
      );
    }
  }, [client, selectTab]);

  const handleQuestionnaireClick = (item: any) => {
    setSelectItem(item);
    setSelectTab('singleQuestionnaire');
  };

  const handleTabClick = (name: string) => {
    setSelectItem(null);
    setSelectTab(name);
  };

  const renderQuestionnaires = () => {
    return questionnaires.map((item: any) => {
      return (
        <div className='row-container' key={item.id} onClick={() => handleQuestionnaireClick(item)}>
          <p className='row-text' dangerouslySetInnerHTML={{ __html: item.text.div }}></p>
          <p className='row-text'>{new Date(item.meta.lastUpdated).toLocaleDateString()}</p>
        </div>
      );
    });
  };

  const renderContent = () => {
    switch (selectTab) {
      case 'questionnaires':
        return <div style={{ marginTop: 40 }}>{questionnaires.length && renderQuestionnaires()}</div>;

      case 'singleQuestionnaire':
        return (
          <Questionnaire
            questionnaire={selectItem}
            setQuestionnaire={setSelectItem}
            practitioner={practitioner}
            client={client}
            setError={setError}
            setIsLoading={setIsLoading}
          />
        );

      case 'history':
      default:
        return (
          <div style={{ marginTop: 40 }}>{questionnaires.length ? renderQuestionnaires() : 'No History Found'}</div>
        );
    }
  };

  console.log(practitioner, questionnaires);

  return !isLoading && practitioner && questionnaires ? (
    <>
      <div className='panel'>
        <div className='panel-heading row'>
          <h2 className='col-md-3' id='navi'>
            {practitioner.resourceType}
          </h2>

          <div className='col-md-8' id='navi'>
            <Nav variant='tabs' defaultActiveKey='/home'>
              <Nav.Item>
                <Nav.Link onClick={() => handleTabClick('questionnaires')}>Questionnaires</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link onClick={() => handleTabClick('history')}>My History</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <button
            className='btn btn-default btn-xs col-md-1'
            id='logout'
            onClick={() => {
              sessionStorage.clear();
              history.push('/');
            }}
          >
            Log out
          </button>
        </div>

        <div className='panel-body'>
          <div className='container-fluid'>
            <div className='row' id='rowtest'>
              <div className='col-md-3 side text-center'>
                <img src={doctorImg} alt='' className='imagewid' />
                <h4>Dr.{practitioner.name[0].family}</h4>
                <p>{practitioner.id}</p>
              </div>
              <div className='col-md-9' id='script'>
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  ) : (
    <LoadingSpinner />
  );
}
