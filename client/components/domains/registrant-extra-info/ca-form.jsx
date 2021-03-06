/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import {
	camelCase,
	difference,
	isEmpty,
	keys,
	map,
	pick,
} from 'lodash';

/**
 * Internal dependencies
 */
import { getContactDetailsExtraCache } from 'state/selectors';
import { updateContactDetailsCache } from 'state/domains/management/actions';
import FormFieldset from 'components/forms/form-fieldset';
import FormLabel from 'components/forms/form-label';
import FormSelect from 'components/forms/form-select';
import FormCheckbox from 'components/forms/form-checkbox';

const ciraAgreementUrl = 'https://services.cira.ca/agree/agreement/agreementVersion2.0.jsp';
const defaultValues = {
	legalType: 'CCT',
	ciraAgreementAccepted: false,
};

class RegistrantExtraInfoCaForm extends React.PureComponent {
	static propTypes = {
		contactDetailsExtra: PropTypes.object.isRequired,
		translate: PropTypes.func.isRequired,
	}

	constructor( props ) {
		super( props );
		const { translate } = props;
		const legalTypes = {
			ABO: translate( 'Aboriginal', {
				comment: 'Refers to indigenous peoples, specifically of Canada.'
			} ),
			ASS: translate( 'Association (Unincorporated)', {
				comment: 'Refers to Canadian legal concept -- encompasses entities ' +
					'like religious congregations, social clubs, community groups, etc'
			} ),
			CCO: translate( 'Canadian Corporation' ),
			CCT: translate( 'Canadian Citizen' ),
			EDU: translate( 'Educational Institution' ),
			GOV: translate( 'Government' ),
			HOP: translate( 'Hospital' ),
			INB: translate( 'Indian Band', {
				comment: 'Refers to Canadian legal concept -- Indian meaning the ' +
					'indigeonous people of North America and band meaning a small ' +
					'group or community'
			} ),
			LAM: translate( 'Library, Archive, or Museum' ),
			LGR: translate( 'Legal Representative' ),
			MAJ: translate( 'Her Majesty the Queen' ),
			OMK: translate( 'Official Mark', {
				comment: 'Refers to a Canadian legal concept -- similar to a trademark'
			} ),
			PLT: translate( 'Political Party' ),
			PRT: translate( 'Partnership' ),
			RES: translate( 'Permanent Resident' ),
			TDM: translate( 'Trademark Owner' ),
			TRD: translate( 'Trade Union' ),
			TRS: translate( 'Trust', {
				comment: 'Refers to the legal concept of trust (noun)'
			} ),
		};
		const legalTypeOptions = map( legalTypes, ( text, optionValue ) =>
			<option value={ optionValue } key={ optionValue }>{ text }</option>
		);

		this.state = {
			legalTypes,
			legalTypeOptions,
		};
	}

	componentWillMount() {
		// Add defaults to redux state to make accepting default values work.
		const requiredDetailsNotInProps = difference(
			[ 'legalType', 'ciraAgreementAccepted' ],
			keys( this.props.contactDetailsExtra ),
		);

		if ( ! isEmpty( requiredDetailsNotInProps ) ) {
			this.props.updateContactDetailsCache( {
				extra: pick( defaultValues, requiredDetailsNotInProps ),
			} );
		}
	}

	handleChangeEvent = ( event ) => {
		const { target } = event;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		this.props.updateContactDetailsCache( {
			extra: { [ camelCase( event.target.id ) ]: value },
		} );
	}

	render() {
		const { translate } = this.props;
		const { legalTypeOptions } = this.state;
		const {
			legalType,
			ciraAgreementAccepted,
		} = { ...defaultValues, ...this.props.contactDetailsExtra };

		return (
			<form className="registrant-extra-info__form">
				<p className="registrant-extra-info__form-desciption">
					{ translate(
						'Almost done! We need some extra details to register your %(tld)s domain.',
						{ args: { tld: '.ca' } }
					) }
				</p>
				<FormFieldset>
					<FormLabel htmlFor="legal-type">
						{ translate( 'Choose the option that best describes you:' ) }
					</FormLabel>
					<FormSelect
						id="legal-type"
						value={ legalType }
						className="registrant-extra-info__form-legal-type"
						onChange={ this.handleChangeEvent }>
						{ legalTypeOptions }
					</FormSelect>
				</FormFieldset>
				<FormFieldset>
					<FormLabel htmlFor="legal-type">
						{ translate( 'CIRA Agreement' ) }
					</FormLabel>
					<FormLabel>
						<FormCheckbox
							id="cira-agreement-accepted"
							value={ ciraAgreementAccepted }
							onChange={ this.handleChangeEvent } />
						<span>{
							translate( 'I have read and agree to the {{a}}CIRA Registrant Agreement{{/a}}',
								{
									components: {
										a: <a href={ ciraAgreementUrl } />,
									},
								}
							)
						}</span>
					</FormLabel>
				</FormFieldset>

				{ this.props.children }
			</form>
		);
	}
}

export default connect(
	state => ( { contactDetailsExtra: getContactDetailsExtraCache( state ) } ),
	{ updateContactDetailsCache }
)( localize( RegistrantExtraInfoCaForm ) );
