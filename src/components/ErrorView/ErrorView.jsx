import { FormattedMessage } from 'react-intl';
import { Container } from 'semantic-ui-react';

/**
 * @function ErrorView
 * @returns {string} Markup of the Error page.
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
        <>
          <p
            className="description"
            style={{
              textAlign: 'center',
              margin: '20px auto',
              width: '475px',
            }}
          >
            <FormattedMessage
              id="Our apologies, our website is not available at the moment."
              defaultMessage="Our apologies, our website is not available at the moment."
            />
          </p>

          <p
            className="description"
            style={{
              textAlign: 'center',
              margin: '20px auto',
              width: '475px',
            }}
          >
            <FormattedMessage
              id="If this problem persists Contact EEA Web Team (web.helpdesk at eea.europa.eu)"
              defaultMessage="If this problem persists Contact EEA Web Team (web.helpdesk at eea.europa.eu)"
            />
          </p>
        </>
      )}
    </Container>
  );
};

export default ErrorView;
