import { ENDPOINTS, fetcher } from '@api/useAxiosSWR';
import { rootStore } from '@store/index';
import { cn } from '@utils/index';
import { enqueueSnackbar } from 'notistack';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { RegisterTrialResponse } from 'types/auth.request';

const TickMark = () => (
  <svg
    className='flex-shrink-0 mt-0.5 h-4 w-4 text-violet-600/60 dark:text-violet-500/60'
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <polyline points='20 6 9 17 4 12' />
  </svg>
);

type Props = {
  isInModal?: boolean;
  isExpiredPlan?: boolean;
};

async function registerTrial(tk: string) {
  try {
    const response: RegisterTrialResponse = await fetcher.post(
      ENDPOINTS.registerTrial,
      {},
      {
        headers: {
          Authorization: `Bearer ${tk}`,
        },
      }
    );
    if (response.status === 200) {
      console.log(response);
      enqueueSnackbar('Trial registered successfully! Please enter your site infos', {
        variant: 'success',
      });
      return true;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

const Pricing = ({ isInModal, isExpiredPlan }: Props) => {
  const tk = rootStore(({ data }) => data.tk);
  const isSignUp = rootStore(({ data }) => data.isSignUp);
  const toggleStarted = rootStore(({ toggleStarted }) => toggleStarted);
  const toggleSignUp = rootStore(({ toggleSignUp }) => toggleSignUp);
  const togglePayment = rootStore(({ togglePayment }) => togglePayment);
  const toggleConfigSite = rootStore(({ toggleConfigSite }) => toggleConfigSite);

  const [showPopup, setShowPopup] = useState(false);

  const mainTitle = isInModal ? 'Choose your plan' : 'Pricing';
  const cta = isInModal ? 'I Want This' : 'Sign In';

  const commonOnClick = () => {
    toggleStarted();
    if (!isSignUp) toggleStarted();
  };

  const handleFreeClicked = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!isInModal) {
      commonOnClick();
      return;
    }
    enqueueSnackbar(`Registering for a trial plan...`, {
      variant: "info",
    });
    const success = await registerTrial(tk);
    if (success) {
      toggleStarted();
    }
  };

  const handlePremiumClicked = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!isInModal) {
      commonOnClick();
      return;
    }
    enqueueSnackbar(`Proceeding to payment...`, {
      variant: "info",
    });
    setShowPopup(true);
    setTimeout(() => {
      toggleStarted();
    }, 1500);
  };

  const plans = [
    {
      title: "Basic",
      price: "300",
      currency: "SAR",
      features: ["Accounting", "Inventory", "Number of Users: 1"],
    },
    {
      title: "Standard",
      price: "400",
      currency: "SAR",
      features: ["Accounting", "Inventory", "HR with 5 Employees", "Number of Users: 3"],
    },
    {
      title: "Premium",
      price: "500",
      currency: "SAR",
      features: [
        "Accounting",
        "Inventory",
        "HR with 10 Employees",
        "Fixed Assets",
        "Number of Users: 5",
      ],
    },
    {
      title: "Platinum",
      price: "600",
      currency: "SAR",
      features: [
        "Accounting",
        "Inventory",
        "CRM",
        "HR with 20 Employees",
        "Fixed Assets",
        "Number of Users: 5",
      ],
    },
  ];

  return (
    <div className='max-w-[80rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto max-h-[620px] lg:max-h-max overflow-y-auto no-scrollbar' id='pricing'>
      <div className='max-w-2xl mx-auto text-center mb-10 lg:mb-14'>
        {isExpiredPlan ? (
          <p className='mt-1 text-red-600 dark:text-red-400'>
            * Your trial has eneded, please kindly upgrade to continue
          </p>
        ) : (
          <p className='mt-1 text-gray-600 dark:text-gray-400'>
            Whatever your status, our offers evolve according to your needs.
          </p>
        )}
      </div>

      <div className='mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            className='flex flex-col border border-gray-200 text-center rounded-xl p-8 dark:border-gray-700 shadow-lg hover:shadow-2xl transition-shadow bg-white dark:bg-gray-900 transform hover:scale-105 transition-transform'
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4, type: 'spring' }}
          >
            <h4 className='font-semibold text-3xl text-gray-800 dark:text-gray-200'>
              {plan.title}
            </h4>
            <span className='mt-3 font-bold text-6xl text-gray-800 dark:text-yellow-400'>
              <span className='text-sm font-medium text-gray-500 dark:text-gray-400'>{plan.currency}</span> {plan.price}
              <span className='text-sm'>/month</span>
            </span>
            <ul className='mt-5 space-y-2.5 text-sm'>
              {plan.features.map((feature, i) => (
                <li key={i} className='flex space-x-2'>
                  <TickMark />
                  <span className='text-gray-800 dark:text-gray-400'>{feature}</span>
                </li>
              ))}
            </ul>
            <div className='mt-6'>
              <motion.a
                className="py-3 px-5 text-sm font-semibold rounded-lg border border-transparent text-white w-full block shadow-md"
                href=""
                initial={{ background: '#5a3950' }}
                animate={{
                  background: [
                    '#5a3950', // darker
                    '#774A67', // base
                    '#8e5779', // lighter
                    '#774A67',
                    '#5a3950',
                  ],
                  boxShadow: [
                    '0 2px 8px rgba(119, 74, 103, 0.2)',
                    '0 4px 12px rgba(119, 74, 103, 0.4)',
                    '0 2px 8px rgba(119, 74, 103, 0.2)',
                  ],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'loop',
                  ease: 'easeInOut',
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 6px 20px rgba(119, 74, 103, 0.5)',
                }}
                onClick={(e) => {
                  e.preventDefault();
                  toggleStarted();
                }}
              >
                {cta}
              </motion.a>
            </div>
          </motion.div>
        ))}
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-sm w-full">
            <p className="text-gray-800 dark:text-gray-200 mb-4 text-lg">
              Sit tight. We will be right back.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/*  */}
      {/* Test */}
      {/* <div
      className='max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto max-h-[620px] lg:max-h-max overflow-y-auto no-scrollbar'
      id='pricing'
    >
      <div className='max-w-2xl mx-auto text-center mb-10 lg:mb-14'>
        <h2 className='text-5xl font-bold md:text-5xl md:leading-tight dark:text-white'>
          {mainTitle}
        </h2>
      </div>

      <div className='mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {plans.map((plan, index) => (
          <div key={index} className='flex flex-col border border-gray-200 text-center rounded-xl p-8 dark:border-gray-700'>
            <h4 className='font-semibold text-xl text-gray-800 dark:text-gray-200'>
              {plan.title}
            </h4>
            <span className='mt-3 font-bold text-5xl text-gray-800 dark:text-yellow-400'>
              <span className='text-lg font-medium'>{plan.currency}</span> {plan.price}
              <span className='text-sm'>/month</span>
            </span>
            <ul className='mt-5 space-y-2.5 text-sm'>
              {plan.features.map((feature, i) => (
                <li key={i} className='flex space-x-2'>
                  <TickMark />
                  <span className='text-gray-800 dark:text-gray-400'>{feature}</span>
                </li>
              ))}
            </ul>
            <div className='mt-6'>
              <a
                className='py-3 px-5 text-sm font-semibold rounded-lg border border-transparent bg-violet-600 text-white hover:bg-violet-700 transition-all dark:hover:bg-violet-800 w-full block'
                href=''
              >
                {cta}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div> */}
      {/* test end */}
      {/* <div className={cn('mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:items-center', { "md:grid-cols-1": isExpiredPlan })}>
        {!isExpiredPlan && (
          <div className='flex flex-col border border-gray-200 text-center rounded-xl p-8 dark:border-gray-700'>
            <h4 className='font-medium text-lg text-gray-800 dark:text-gray-200'>
              Free
            </h4>
            <span className='mt-7 font-bold text-5xl text-gray-800 dark:text-yellow-400'>
              Free
            </span>
            <p className='mt-2 text-sm text-gray-500'>Trial up to 14 days</p>

            <ul className='mt-7 space-y-2.5 text-sm'>
              <li className='flex space-x-2'>
                <TickMark />
                <span className='text-gray-800 dark:text-gray-400'>1 user</span>
              </li>

              <li className='flex space-x-2'>
                <TickMark />
                <span className='text-gray-800 dark:text-gray-400'>
                  Plan features
                </span>
              </li>

              <li className='flex space-x-2'>
                <TickMark />
                <span className='text-gray-800 dark:text-gray-400'>
                  Normal Product support
                </span>
              </li>
            </ul>

            <a
              className='mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg 
            border border-transparent bg-violet-100/60 text-violet-800/60 hover:bg-violet-200/60 
            disabled:opacity-50 disabled:pointer-events-none 
            dark:hover:bg-violet-800/60 dark:text-[#203030] dark:hover:text-white
            dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'
              href=''
              onClick={handleFreeClicked}
            >
              {cta}
            </a>
          </div>
        )}

        <div className='flex flex-col border-2 border-violet-600/60 text-center shadow-xl rounded-xl p-8 dark:border-violet-700/60'>
          <p className='mb-3'>
            <span className='inline-flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs uppercase font-semibold bg-violet-100/60 text-violet-800/60 dark:bg-violet-600/60 dark:text-white'>
              Most popular
            </span>
          </p>
          <h4 className='font-medium text-lg text-gray-800 dark:text-gray-200'>
            Premium
          </h4>
          <span className='mt-5 font-bold text-5xl text-gray-800 dark:text-yellow-400'>
            <span className='font-bold text-2xl -my-2'>$</span>
            1.00
          </span>
          <p className='mt-2 text-sm text-gray-500'>
            All the basics for starting a new business
          </p>

          <ul className='mt-7 space-y-2.5 text-sm'>
            <li className='flex space-x-2'>
              <svg
                className='flex-shrink-0 mt-0.5 h-4 w-4 text-violet-600/60 dark:text-violet-500/60'
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <polyline points='20 6 9 17 4 12' />
              </svg>
              <span className='text-gray-800 dark:text-gray-400'>
                Unlimited users
              </span>
            </li>

            <li className='flex space-x-2'>
              <svg
                className='flex-shrink-0 mt-0.5 h-4 w-4 text-violet-600/60 dark:text-violet-500/60'
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <polyline points='20 6 9 17 4 12' />
              </svg>
              <span className='text-gray-800 dark:text-gray-400'>
                All exclusive features
              </span>
            </li>

            <li className='flex space-x-2'>
              <svg
                className='flex-shrink-0 mt-0.5 h-4 w-4 text-violet-600/60 dark:text-violet-500/60'
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <polyline points='20 6 9 17 4 12' />
              </svg>
              <span className='text-gray-800 dark:text-gray-400'>
                Fast Product support
              </span>
            </li>
          </ul>

          <a
            className='mt-5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold 
            rounded-lg border border-transparent bg-violet-600/60 text-white hover:bg-violet-700/60 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600'
            href=''
            onClick={handlePremiumClicked}
          >
            {cta}
          </a>
        </div>
      </div> */}
    </div>
  );
};

export default Pricing;
