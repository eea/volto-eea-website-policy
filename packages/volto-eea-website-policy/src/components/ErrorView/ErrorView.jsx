import { FormattedMessage } from 'react-intl';
import { Container } from 'semantic-ui-react';

/**
 * @function ErrorView
 * @returns {string} Static Markup of the Error page.
 */
const ErrorView = ({ name, error }) => {
  return (
    <Container
      className="view-wrapper"
      style={{
        fontFamily: 'Helvetica, sans-serif',
        fontSize: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#006699',
        minHeight: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {__DEVELOPMENT__ && (
        <>
          {error && (
            <div
              style={{
                backgroundColor: '#f8f8f8',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '20px',
                margin: '20px 0',
                maxWidth: '90%',
                overflow: 'auto',
                textAlign: 'center',
              }}
            >
              <h3 style={{ marginTop: 0, color: '#d32f2f' }}>
                Error Details (Development Mode)
              </h3>
              {error.name && (
                <p>
                  <strong>Error Name:</strong> {error.name}
                </p>
              )}
              {error.message && (
                <p>
                  <strong>Error Message:</strong> {error.message}
                </p>
              )}
              {error.status && (
                <p>
                  <strong>Status:</strong> {error.status}
                </p>
              )}
              {error.stack && (
                <>
                  <p>
                    <strong>Stack Trace:</strong>
                  </p>
                  <pre
                    style={{
                      backgroundColor: '#f0f0f0',
                      padding: '10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      lineHeight: '1.4',
                      overflow: 'auto',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {error.stack}
                  </pre>
                </>
              )}
              {name && (
                <p>
                  <strong>Component Name:</strong> {name}
                </p>
              )}
            </div>
          )}
        </>
      )}
      {!__DEVELOPMENT__ && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
            color: 'white',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '18px',
                fontWeight: 'normal',
                margin: '0 0 10px 0',
                color: 'white',
              }}
            >
              European Environment Agency (EEA)
            </h1>
            <a
              href="https://www.eea.europa.eu"
              style={{
                color: 'white',
                textDecoration: 'underline',
                fontSize: '16px',
              }}
            >
              www.eea.europa.eu
            </a>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.3)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '30px 0',
              margin: '20px 0',
              width: '600px',
              maxWidth: '90%',
            }}
          >
            <h2
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '0',
                color: 'white',
                lineHeight: '1.4',
              }}
            >
              <FormattedMessage
                id="Our apologies, our website is not available at the moment."
                defaultMessage="Our apologies, our website is not available at the moment."
              />
            </h2>
          </div>

          <div>
            <p
              style={{
                fontSize: '16px',
                fontStyle: 'italic',
                margin: '0 0 20px 0',
                color: 'white',
              }}
            >
              <FormattedMessage
                id="If this problem persists Contact EEA Web Team (web.helpdesk at eea.europa.eu)"
                defaultMessage="If this problem persists Contact EEA Web Team (web.helpdesk at eea.europa.eu)"
              />
            </p>
            <p
              style={{
                fontSize: '14px',
                margin: '0',
                color: 'white',
                lineHeight: '1.4',
              }}
            >
              <span style={{ textDecoration: 'underline' }}>
                European Environment Agency
              </span>
              , Kongens Nytorv 6, 1050
              <br />
              Copenhagen K, Denmark - Phone: +45 3336 7100
            </p>
          </div>
        </div>
      )}
    </Container>
  );
};

export default ErrorView;
