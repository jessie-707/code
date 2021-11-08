import React, { useEffect, useState, DragEvent } from 'react';
import { Button, Form, FormControl, InputGroup, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router';
import _ from 'lodash';
import usePrevious from '../hooks/usePrevious';

import doctorImg from '../images/doctorX.png';
import patientImg from '../images/girl.png';
import * as Icon from 'react-bootstrap-icons';

interface Props {
  questionnaire: any;
  setQuestionnaire: any;
  practitioner: any;
  client: any;
  setError: any;
  setIsLoading: any;
}

export default function Questionnaire(props: Props) {
  const { questionnaire, setQuestionnaire, practitioner, client, setError, setIsLoading } = props;

  const [isCommentsInpuOpen, setIsCommentsInpuOpen] = useState(false);
  const [selectId, setSelectId] = useState('');
  const [commentInput, setCommentInput] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);

  const prevSelect = usePrevious(selectId);

  useEffect(() => {
    if (prevSelect === selectId) {
      setIsCommentsInpuOpen(!isCommentsInpuOpen);
    }

    if (prevSelect !== selectId) {
      setIsCommentsInpuOpen(true);
    }
  }, [selectId]);

  const handleUpdate = (updateQuestionnaire: any) => {
    setIsUpdate(true);
    Promise.all([client.update(updateQuestionnaire, `/QuestionnaireResponse/${updateQuestionnaire.id}`)]).then(
      ([questionnaire]) => {
        setQuestionnaire(questionnaire);
        setIsUpdate(false);
      },
      (error) => {
        setError(error);
        setIsUpdate(false);
      }
    );
  };

  const handleQuestionClick = (questionnaireItem: any) => {
    setSelectId(questionnaireItem.linkId);
    setIsCommentsInpuOpen(!isCommentsInpuOpen);
  };

  const handleChange = (event: any) => {
    setCommentInput(event.target.value);
  };

  const handleSubmit = (event: any, questionnaireItem: any) => {
    event.preventDefault();

    // set item linkId as the comment name
    // set item text as the comment content
    // set item valueInteger as the total thumb-up numbers
    const formatData = {
      item: [
        {
          linkId: `Dr.${practitioner.name[0].family}`,
          text: commentInput,
          answer: [
            {
              valueInteger: 0,
            },
          ],
        },
      ],
    };

    questionnaireItem.answer.push(formatData);

    handleUpdate(questionnaire);
  };

  const handleLikeClick = (value: number, questionnaireItem: any, index: number) => {
    questionnaireItem.answer[index + 1].item[0].answer[0].valueInteger = value + 1;

    handleUpdate(questionnaire);
  };

  // TODO: add all answer types
  // "valueBoolean" : <boolean>,
  // "valueDecimal" : <decimal>,
  // "valueInteger" : <integer>,
  // "valueDate" : "<date>",
  // "valueDateTime" : "<dateTime>",
  // "valueTime" : "<time>",
  // "valueString" : "<string>",
  // "valueUri" : "<uri>",
  // "valueAttachment" : { Attachment },
  // "valueCoding" : { Coding },
  // "valueQuantity" : { Quantity },
  // "valueReference" : { Reference(Any) },
  const renderAnswer = (answers: any[]) => {
    return answers.map((a) => {
      if (a['valueCoding']) {
        return a.valueCoding.code;
      }
      if (a['valueString']) {
        return a.valueString;
      }
      return null;
    });
  };

  const renderComments = (answers: any[], questionnaireItem: any) => {
    // get custom answer from original resources
    const comments = answers.slice().splice(1, answers.length - 1);

    if (comments && comments.length) {
      return comments.map((a, index) => {
        return (
          <div key={index} className={'innerCommentsContainer'}>
            <p>
              <span>{a.item[0].linkId}:</span>
              <span className={'commentText'}>{a.item[0].text}</span>
            </p>
            <div
              className={'likeContainer'}
              onClick={() => handleLikeClick(a.item[0].answer[0].valueInteger, questionnaireItem, index)}
            >
              <Icon.HandThumbsUp className={'likeIcon'} />
              <span className={'likeText'}>Helpful</span>
              <span>{a.item[0].answer[0].valueInteger}</span>
            </div>
          </div>
        );
      });
    }

    return null;
  };

  const renderDialog = () => {
    return (
      questionnaire.item &&
      questionnaire.item.length &&
      questionnaire.item.map((q: any) => (
        <div key={q.linkId}>
          <div className={'questionContainer'}>
            <img className={'questionImg'} src={doctorImg} alt='doctorImg' />
            <div className='doctorTextContainer'>
              <div className='transcript' key={q.linkId} onClick={() => handleQuestionClick(q)}>
                {q.text}
              </div>
              {q.answer && q.answer.length && <div className='commentsContainer'>{renderComments(q.answer, q)}</div>}
              {isCommentsInpuOpen && selectId === q.linkId && (
                <div className='inputContainer'>
                  <Form onSubmit={(e) => handleSubmit(e, q)}>
                    <Form.Group>
                      <InputGroup hasValidation>
                        <FormControl required type='text' placeholder='Add a comment' onChange={handleChange} />
                        {isUpdate ? (
                          <Button variant='primary' disabled>
                            <Spinner as='span' animation='border' size='sm' role='status' />
                            Submitting...
                          </Button>
                        ) : (
                          <Button type='submit' variant='outline-secondary'>
                            Submit
                          </Button>
                        )}
                      </InputGroup>
                    </Form.Group>
                  </Form>
                </div>
              )}
            </div>
          </div>
          <div className={'answerContainer'}>
            <img className={'questionImg'} src={patientImg} alt='patientImg' />
            <div className='transcript_answer'>{q.answer && q.answer.length && renderAnswer(q.answer)}</div>
          </div>
        </div>
      ))
    );
  };

  return (
    <>
      <div className='questionnaireContainer'>
        <div className='title'>
          <p className='row-text' dangerouslySetInnerHTML={{ __html: questionnaire.text.div }}></p>
        </div>
        <div className='dialogContainer'>{renderDialog()}</div>
      </div>
    </>
  );
}
